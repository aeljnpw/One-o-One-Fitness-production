import { useState, useEffect } from 'react';
import { supabase, Exercise, Equipment } from '@/lib/supabase';

export type ExerciseWithEquipment = Exercise & {
  equipment_data?: Equipment;
};

export function useExercises() {
  const [exercises, setExercises] = useState<ExerciseWithEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          equipment_data:equipment_id(*)
        `)
        .order('name');

      if (error) throw error;
      
      setExercises(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exercises');
    } finally {
      setLoading(false);
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
    filterExercises 
  };
}