import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Database } from '@/lib/types';

// Define types based on Database type
type Tables = Database['public']['Tables'];
type WorkoutTemplate = Tables['workout_templates']['Row'];
type Exercise = Tables['exercises']['Row'];
type WorkoutTemplateExercise = Tables['workout_template_exercises']['Row'] & {
  exercise: Exercise;
};

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

      console.log('Fetching workout templates for equipment:', equipmentName);

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

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Successfully fetched workout templates:', data?.length || 0);
      setTemplates(data || []);
      
      // If no templates found, let's check if there are any templates at all
      if (!data || data.length === 0) {
        const { data: allTemplates, count, error: allError } = await supabase
          .from('workout_templates')
          .select('*', { count: 'exact' });
        
        if (allError) {
          console.error('Error checking total templates:', allError.message);
        } else {
          console.log('Total templates in database:', count || 0);
        }
      }
      
    } catch (err) {
      console.error('Error fetching workout templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workout templates');
      setTemplates([]); // Clear templates on error
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

      console.log('Fetching template with exercises for ID:', templateId);

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
        .single();

      if (error) {
        console.error('Error fetching template with exercises:', error);
        throw error;
      }
      
      // Sort exercises by order_index
      if (data?.exercises) {
        data.exercises.sort((a: WorkoutTemplateExercise, b: WorkoutTemplateExercise) => a.order_index - b.order_index);
      }
      
      console.log('Successfully fetched template with exercises:', data?.exercises?.length || 0);
      return data as WorkoutTemplateWithExercises;
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
        .single();

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
        .single();

      if (error) throw error;
      
      return data as WorkoutTemplateExercise;
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