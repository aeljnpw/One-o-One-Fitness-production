import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

export interface Equipment {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category: string;
  created_at: string;
  updated_at: string;
  exercises?: {
    id: string;
    name: string;
  }[];
}

export function useEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Starting equipment fetch...');
      
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      console.log('✅ Supabase client initialized, making query...');

      // First, test if we can access the table at all
      const { count, error: countError } = await supabase
        .from('equipment')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('❌ Error checking equipment table:', countError);
        throw new Error(`Failed to access equipment table: ${countError.message}`);
      }

      console.log('📊 Total equipment count:', count);

      // Now fetch the actual data - without exercises for now
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('name')
        .returns<Equipment[]>();

      if (error) {
        console.error('❌ Error fetching equipment:', error);
        throw error;
      }

      if (!data) {
        console.warn('⚠️ No equipment data returned');
        setEquipment([]);
        return;
      }

      // Add empty exercises array to match the interface
      const equipmentWithEmptyExercises = data.map(item => ({
        ...item,
        exercises: []
      }));

      console.log('✅ Equipment fetched successfully:', {
        count: equipmentWithEmptyExercises.length,
        items: equipmentWithEmptyExercises.map(eq => ({ id: eq.id, name: eq.name })),
        categories: [...new Set(equipmentWithEmptyExercises.map(e => e.category))],
        sampleIds: equipmentWithEmptyExercises.slice(0, 3).map(eq => eq.id)
      });

      setEquipment(equipmentWithEmptyExercises);
    } catch (err) {
      console.error('❌ Error in fetchEquipment:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const getEquipmentById = async (id: string): Promise<Equipment | null> => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', id)
        .single()
        .returns<Equipment>();

      if (error) {
        console.error('❌ Error fetching equipment by ID:', error);
        throw error;
      }
      
      // Add empty exercises array to match the interface
      return data ? { ...data, exercises: [] } : null;
    } catch (err) {
      console.error('❌ Error in getEquipmentById:', err);
      return null;
    }
  };

  return { 
    equipment, 
    loading, 
    error, 
    refetch: fetchEquipment,
    getEquipmentById
  };
}