import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_id: string | null;
  name: string;
  duration: number;
  calories_burned: number;
  notes: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
  workout?: {
    id: string;
    name: string;
    duration: number;
  };
}

export interface ExerciseSet {
  id: string;
  workout_session_id: string;
  exercise_id: string;
  set_number: number;
  reps: number | null;
  weight: number | null;
  duration: number | null;
  distance: number | null;
  rest_time: number | null;
  notes: string | null;
  completed_at: string | null;
  exercise: {
    id: string;
    name: string;
    muscle_group: string;
    difficulty: string;
    type: string | null;
    equipment: string | null;
    thumbnail_url: string | null;
    video_url: string | null;
    proper_form: string | null;
    common_mistakes: string | null;
    tips: string | null;
    instructions: string[] | null;
    primary_muscles: string[] | null;
    secondary_muscles: string[] | null;
    equipment_id: string | null;
  };
}

export interface WorkoutSessionWithSets extends WorkoutSession {
  exercise_sets: ExerciseSet[];
}

// Mock data
const mockSessions: WorkoutSession[] = [
  {
    id: '1',
    user_id: 'mock-user-1',
    workout_id: '1',
    name: 'Morning Full Body Workout',
    duration: 60,
    calories_burned: 450,
    notes: 'Great session, felt strong!',
    completed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'mock-user-1',
    workout_id: '2',
    name: 'Evening HIIT Session',
    duration: 30,
    calories_burned: 300,
    notes: 'Intense cardio workout',
    completed_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function useWorkoutSessions() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkoutSessions();
  }, []);

  const fetchWorkoutSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          workout:workouts (
            id,
            name,
            duration
          )
        `)
        .order('completed_at', { ascending: false })
        .limit(10)
        .returns<WorkoutSession[]>();

      if (error) throw error;
      
      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching workout sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workout sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionWithSets = async (sessionId: string): Promise<WorkoutSessionWithSets | null> => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          workout:workouts (
            id,
            name,
            duration
          ),
          exercise_sets (
            *,
            exercise:exercises (
              id,
              name,
              muscle_group,
              difficulty,
              type,
              equipment,
              thumbnail_url,
              video_url,
              proper_form,
              common_mistakes,
              tips,
              instructions,
              primary_muscles,
              secondary_muscles,
              equipment_id
            )
          )
        `)
        .eq('id', sessionId)
        .single()
        .returns<WorkoutSessionWithSets>();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error fetching session with sets:', err);
      return null;
    }
  };

  const createWorkoutSession = async (sessionData: {
    name: string;
    workout_id?: string;
    duration?: number;
    calories_burned?: number;
    notes?: string;
  }): Promise<WorkoutSession | null> => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([{
          ...sessionData,
          duration: sessionData.duration || 0,
          calories_burned: sessionData.calories_burned || 0,
        }])
        .select(`
          *,
          workout:workouts (
            id,
            name,
            duration
          )
        `)
        .single()
        .returns<WorkoutSession>();

      if (error) throw error;
      
      // Refresh the sessions list
      fetchWorkoutSessions();
      
      return data;
    } catch (err) {
      console.error('Error creating workout session:', err);
      return null;
    }
  };

  const updateWorkoutSession = async (
    sessionId: string, 
    updates: Partial<WorkoutSession>
  ): Promise<boolean> => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await supabase
        .from('workout_sessions')
        .update(updates)
        .eq('id', sessionId);

      if (error) throw error;
      
      // Refresh the sessions list
      fetchWorkoutSessions();
      
      return true;
    } catch (err) {
      console.error('Error updating workout session:', err);
      return false;
    }
  };

  const addExerciseSet = async (setData: {
    workout_session_id: string;
    exercise_id: string;
    set_number: number;
    reps?: number;
    weight?: number;
    duration?: number;
    distance?: number;
    rest_time?: number;
    notes?: string;
  }): Promise<ExerciseSet | null> => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('exercise_sets')
        .insert([setData])
        .select(`
          *,
          exercise:exercises (
            id,
            name,
            muscle_group,
            difficulty,
            type,
            equipment,
            thumbnail_url,
            video_url,
            proper_form,
            common_mistakes,
            tips,
            instructions,
            primary_muscles,
            secondary_muscles,
            equipment_id
          )
        `)
        .single()
        .returns<ExerciseSet>();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error adding exercise set:', err);
      return null;
    }
  };

  return { 
    sessions, 
    loading, 
    error, 
    refetch: fetchWorkoutSessions,
    fetchSessionWithSets,
    createWorkoutSession,
    updateWorkoutSession,
    addExerciseSet
  };
}