import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number;
  target_muscles: string[];
  equipment_needed: string[];
  category: string;
  is_public: boolean;
  created_by: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutTemplateWithExercises extends WorkoutTemplate {
  exercises: WorkoutTemplateExercise[];
}

export interface WorkoutTemplateExercise {
  id: string;
  template_id: string;
  exercise_id: string;
  order_index: number;
  sets: number;
  reps: number | null;
  duration: number | null;
  rest_time: number;
  notes: string | null;
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
  };
}

export function useWorkoutTemplates(equipmentName?: string) {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkoutTemplates();
  }, [equipmentName]);

  const fetchWorkoutTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('workout_templates')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      // Filter by equipment if provided
      if (equipmentName) {
        query = query.contains('equipment_needed', [equipmentName]);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setTemplates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workout templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateWithExercises = async (templateId: string): Promise<WorkoutTemplateWithExercises | null> => {
    try {
      const { data, error } = await supabase
        .from('workout_templates')
        .select(`
          *,
          exercises:workout_template_exercises(
            *,
            exercise:exercises(*)
          )
        `)
        .eq('id', templateId)
        .single();

      if (error) throw error;
      
      return data as WorkoutTemplateWithExercises;
    } catch (err) {
      console.error('Error fetching template with exercises:', err);
      return null;
    }
  };

  return { 
    templates, 
    loading, 
    error, 
    refetch: fetchWorkoutTemplates,
    fetchTemplateWithExercises 
  };
}