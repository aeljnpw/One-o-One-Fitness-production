import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

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
    equipment_id: string | null;
  };
}

export interface WorkoutTemplateWithExercises extends WorkoutTemplate {
  exercises: WorkoutTemplateExercise[];
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
      
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check your environment variables.');
      }

      let query = supabase
        .from('workout_templates')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      // Filter by equipment if provided
      if (equipmentName) {
        query = query.contains('equipment_needed', [equipmentName]);
      }

      const { data, error } = await query.returns<WorkoutTemplate[]>();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Fetched workout templates:', data?.length || 0);
      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching workout templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workout templates');
      // Don't set empty array on error, keep existing data
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateWithExercises = async (templateId: string): Promise<WorkoutTemplateWithExercises | null> => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('workout_templates')
        .select(`
          *,
          exercises:workout_template_exercises (
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
        .eq('id', templateId)
        .single()
        .returns<WorkoutTemplateWithExercises>();

      if (error) {
        console.error('Error fetching template with exercises:', error);
        throw error;
      }
      
      // Sort exercises by order_index
      if (data?.exercises) {
        data.exercises.sort((a, b) => a.order_index - b.order_index);
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching template with exercises:', err);
      return null;
    }
  };

  const createTemplate = async (template: Omit<WorkoutTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<WorkoutTemplate | null> => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('workout_templates')
        .insert([template])
        .select()
        .single()
        .returns<WorkoutTemplate>();

      if (error) throw error;

      // Refresh templates list
      fetchWorkoutTemplates();
      
      return data;
    } catch (err) {
      console.error('Error creating workout template:', err);
      return null;
    }
  };

  const addExerciseToTemplate = async (
    templateId: string,
    exerciseData: Omit<WorkoutTemplateExercise, 'id' | 'template_id' | 'exercise'>
  ): Promise<WorkoutTemplateExercise | null> => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('workout_template_exercises')
        .insert([{
          ...exerciseData,
          template_id: templateId
        }])
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
        .returns<WorkoutTemplateExercise>();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error adding exercise to template:', err);
      return null;
    }
  };

  return { 
    templates, 
    loading, 
    error, 
    refetch: fetchWorkoutTemplates,
    fetchTemplateWithExercises,
    createTemplate,
    addExerciseToTemplate
  };
}