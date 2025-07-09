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
      
      console.log('🔍 Fetching exercises from database...');
      
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          equipment_data:equipment!equipment_id (
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
      
      console.log('✅ Successfully fetched exercises:', {
        total: data?.length || 0,
        withEquipment: data?.filter(ex => ex.equipment_id).length || 0,
        equipmentIds: [...new Set(data?.map(ex => ex.equipment_id).filter(Boolean))] || [],
        sampleExercises: data?.slice(0, 3).map(ex => ({
          id: ex.id,
          name: ex.name,
          equipment_id: ex.equipment_id,
          hasEquipmentData: !!ex.equipment_data
        })) || []
      });
      
      setExercises(data || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch exercises');
    } finally {
      setLoading(false);
    }
  };

  const getExercisesByEquipmentId = (equipmentId: string) => {
    console.log('🔍 Filtering exercises for equipment ID:', equipmentId);
    
    // Validate equipment_id types in exercises
    exercises.forEach(exercise => {
      if (exercise.equipment_id && typeof exercise.equipment_id !== 'string') {
        console.warn('Invalid equipment_id type:', {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          equipment_id: exercise.equipment_id,
          type: typeof exercise.equipment_id
        });
      }
    });
    
    console.log('🔍 Available exercises with equipment_id:', 
      exercises.filter(ex => ex.equipment_id).map(ex => ({ 
        id: ex.id, 
        name: ex.name, 
        equipment_id: ex.equipment_id,
        equipment_id_type: typeof ex.equipment_id
      }))
    );
    
    // Ensure both values are strings for comparison
    const filtered = exercises.filter(exercise => {
      const exerciseEquipmentId = String(exercise.equipment_id || '');
      const searchEquipmentId = String(equipmentId || '');
      return exerciseEquipmentId === searchEquipmentId && exerciseEquipmentId !== '';
    });
    
    console.log('✅ Found exercises for equipment:', {
      equipmentId,
      count: filtered.length,
      exercises: filtered.map(ex => ({ id: ex.id, name: ex.name }))
    });
    
    return filtered;
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
          equipment_data:equipment!equipment_id (
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
    getExercisesByEquipmentId,
    getExerciseById,
    filterExercises 
  };
}