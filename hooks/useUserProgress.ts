import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

export interface UserProgressData {
  totalWorkouts: number;
  thisMonthWorkouts: number;
  totalTimeMinutes: number;
  currentStreak: number;
  longestStreak: number;
  totalCaloriesBurned: number;
  weeklyWorkouts: number[];
  weeklyGoalProgress: number;
  calorieGoalProgress: number;
  streakGoalProgress: number;
  recentAchievements: Achievement[];
  personalRecords: PersonalRecord[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'consistency' | 'goal' | 'milestone' | 'personal_record';
  icon: string;
}

export interface PersonalRecord {
  exercise: string;
  value: string;
  date: string;
  type: 'reps' | 'weight' | 'duration' | 'distance';
}

export function useUserProgress() {
  const [progressData, setProgressData] = useState<UserProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get user profile for basic stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      // Get workout sessions for detailed analytics
      const { data: workoutSessions } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Get exercise sets for personal records
      const { data: exerciseSets } = await supabase
        .from('exercise_sets')
        .select(`
          *,
          workout_session:workout_sessions!inner(user_id)
        `)
        .eq('workout_session.user_id', user.id)
        .order('created_at', { ascending: false });

      // Calculate progress data
      const progressData = calculateProgressData(profile, workoutSessions || [], exerciseSets || []);
      setProgressData(progressData);

    } catch (err) {
      console.error('Error fetching user progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch progress data');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgressData = (
    profile: any,
    sessions: any[],
    sets: any[]
  ): UserProgressData => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Calculate weekly workout data (last 7 days)
    const weeklyWorkouts = Array(7).fill(0);
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();

    sessions.forEach(session => {
      const sessionDate = new Date(session.completed_at).toDateString();
      const dayIndex = last7Days.indexOf(sessionDate);
      if (dayIndex !== -1) {
        weeklyWorkouts[dayIndex] += session.duration || 0;
      }
    });

    // Calculate this month's workouts
    const thisMonthWorkouts = sessions.filter(session => 
      new Date(session.completed_at) >= startOfMonth
    ).length;

    // Calculate total time
    const totalTimeMinutes = sessions.reduce((total, session) => 
      total + (session.duration || 0), 0
    );

    // Calculate total calories
    const totalCaloriesBurned = sessions.reduce((total, session) => 
      total + (session.calories_burned || 0), 0
    );

    // Calculate streak (simplified - consecutive days with workouts)
    const currentStreak = calculateCurrentStreak(sessions);
    const longestStreak = profile?.longest_streak || currentStreak;

    // Generate achievements based on real data
    const achievements = generateAchievements(sessions, profile, currentStreak);

    // Generate personal records from exercise sets
    const personalRecords = generatePersonalRecords(sets);

    // Calculate goal progress (using realistic targets)
    const weeklyGoalProgress = Math.min((thisMonthWorkouts / 12) * 100, 100); // 12 workouts per month target
    const calorieGoalProgress = Math.min((totalCaloriesBurned / 10000) * 100, 100); // 10k calories target
    const streakGoalProgress = Math.min((currentStreak / 30) * 100, 100); // 30-day streak target

    return {
      totalWorkouts: sessions.length,
      thisMonthWorkouts,
      totalTimeMinutes,
      currentStreak,
      longestStreak,
      totalCaloriesBurned,
      weeklyWorkouts,
      weeklyGoalProgress,
      calorieGoalProgress,
      streakGoalProgress,
      recentAchievements: achievements,
      personalRecords,
    };
  };

  const calculateCurrentStreak = (sessions: any[]): number => {
    if (sessions.length === 0) return 0;

    const sortedSessions = sessions
      .map(s => new Date(s.completed_at).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index) // Remove duplicates
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const sessionDateStr of sortedSessions) {
      const sessionDate = new Date(sessionDateStr);
      const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays === streak + 1) {
        // Allow for one day gap (yesterday)
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const generateAchievements = (sessions: any[], profile: any, streak: number): Achievement[] => {
    const achievements: Achievement[] = [];
    const now = new Date();

    // Streak achievements
    if (streak >= 7) {
      achievements.push({
        id: 'streak-7',
        title: 'Consistency Master',
        description: `Completed ${streak} workouts in a row`,
        date: 'Today',
        type: 'consistency',
        icon: '🔥'
      });
    }

    // Workout count achievements
    if (sessions.length >= 10) {
      achievements.push({
        id: 'workouts-10',
        title: 'Dedicated Athlete',
        description: `Completed ${sessions.length} total workouts`,
        date: sessions.length === 10 ? 'Today' : '2 days ago',
        type: 'milestone',
        icon: '🏆'
      });
    }

    // Monthly goal achievement
    const thisMonth = sessions.filter(s => 
      new Date(s.completed_at).getMonth() === now.getMonth()
    ).length;
    
    if (thisMonth >= 12) {
      achievements.push({
        id: 'monthly-goal',
        title: 'Goal Crusher',
        description: 'Exceeded monthly workout goal',
        date: '1 day ago',
        type: 'goal',
        icon: '🎯'
      });
    }

    return achievements.slice(0, 3); // Return only the most recent 3
  };

  const generatePersonalRecords = (sets: any[]): PersonalRecord[] => {
    const records: PersonalRecord[] = [];
    const exerciseRecords: { [key: string]: any } = {};

    // Group sets by exercise and find max values
    sets.forEach(set => {
      const exerciseName = set.exercise?.name || 'Unknown Exercise';
      
      if (!exerciseRecords[exerciseName]) {
        exerciseRecords[exerciseName] = {
          maxReps: 0,
          maxWeight: 0,
          maxDuration: 0,
          latestDate: set.completed_at
        };
      }

      const record = exerciseRecords[exerciseName];
      if (set.reps && set.reps > record.maxReps) {
        record.maxReps = set.reps;
        record.latestDate = set.completed_at;
      }
      if (set.weight && set.weight > record.maxWeight) {
        record.maxWeight = set.weight;
        record.latestDate = set.completed_at;
      }
      if (set.duration && set.duration > record.maxDuration) {
        record.maxDuration = set.duration;
        record.latestDate = set.completed_at;
      }
    });

    // Convert to PersonalRecord format
    Object.entries(exerciseRecords).forEach(([exercise, data]: [string, any]) => {
      if (data.maxReps > 0) {
        records.push({
          exercise,
          value: `${data.maxReps} reps`,
          date: new Date(data.latestDate).toLocaleDateString(),
          type: 'reps'
        });
      }
      if (data.maxWeight > 0) {
        records.push({
          exercise,
          value: `${data.maxWeight} kg`,
          date: new Date(data.latestDate).toLocaleDateString(),
          type: 'weight'
        });
      }
      if (data.maxDuration > 0) {
        records.push({
          exercise,
          value: `${Math.floor(data.maxDuration / 60)}:${(data.maxDuration % 60).toString().padStart(2, '0')}`,
          date: new Date(data.latestDate).toLocaleDateString(),
          type: 'duration'
        });
      }
    });

    return records.slice(0, 5); // Return top 5 records
  };

  return {
    progressData,
    loading,
    error,
    refetch: fetchUserProgress
  };
}