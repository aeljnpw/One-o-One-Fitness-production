import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

export interface Exercise {
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
  created_at: string;
  equipment_data?: {
    id: string;
    name: string;
    description: string;
    image_url: string | null;
    category: string;
  };
}

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          equipment_data:equipment_id (
            id,
            name,
            description,
            image_url,
            category
          )
        `)
        .order('name')
        .returns<Exercise[]>();

      if (error) throw error;
      
      setExercises(data || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch exercises');
    } finally {
      setLoading(false);
    }
  };

  const getExerciseById = async (id: string): Promise<Exercise | null> => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          equipment_data:equipment_id (
            id,
            name,
            description,
            image_url,
            category
          )
        `)
        .eq('id', id)
        .single()
        .returns<Exercise>();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error fetching exercise by ID:', err);
      return null;
    }
  };

  const filterExercises = (
    searchQuery: string = '',
    selectedCategory: string = 'All',
    selectedEquipment: string = 'All'
  ) => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (exercise.primary_muscles || []).some(muscle => 
                             muscle.toLowerCase().includes(searchQuery.toLowerCase())
                           ) ||
                           (exercise.secondary_muscles || []).some(muscle => 
                             muscle.toLowerCase().includes(searchQuery.toLowerCase())
                           );
      
      const matchesCategory = selectedCategory === 'All' || exercise.muscle_group === selectedCategory;
      
      const matchesEquipment = selectedEquipment === 'All' || 
                              exercise.equipment_data?.name === selectedEquipment ||
                              (selectedEquipment === 'Bodyweight' && !exercise.equipment_data);
      
      return matchesSearch && matchesCategory && matchesEquipment;
    });
  };

  return { 
    exercises, 
    loading, 
    error, 
    refetch: fetchExercises,
    getExerciseById,
    filterExercises 
  };
}