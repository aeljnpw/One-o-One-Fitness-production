import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
}

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
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setSessions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workout sessions');
    } finally {
      setLoading(false);
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
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([{
          ...sessionData,
          duration: sessionData.duration || 0,
          calories_burned: sessionData.calories_burned || 0,
        }])
        .select()
        .single();

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
      const { data, error } = await supabase
        .from('exercise_sets')
        .insert([setData])
        .select()
        .single();

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
    createWorkoutSession,
    updateWorkoutSession,
    addExerciseSet
  };
}