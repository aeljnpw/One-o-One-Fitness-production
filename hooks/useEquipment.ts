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

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Starting equipment fetch...');
      
      const supabase = getSupabase();
      if (!supabase) {
        console.error('❌ Supabase client not initialized');
        throw new Error('Supabase client not initialized');
      }

      console.log('✅ Supabase client initialized, making query...');

      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          exercises (
            id,
            name
          )
        `)
        .order('name')
        .returns<Equipment[]>();

      console.log('📊 Query result:', { data: data?.length || 0, error });

      if (error) throw error;
      
      console.log('✅ Equipment fetched successfully:', data?.length || 0, 'items');
      setEquipment(data || []);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment');
      console.log('❌ Equipment fetch failed:', err);
    } finally {
      setLoading(false);
      console.log('🏁 Equipment fetch completed');
    }
  };

  const getEquipmentById = async (id: string): Promise<Equipment | null> => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          exercises (
            id,
            name,
            muscle_group,
            difficulty,
            type,
            thumbnail_url,
            video_url,
            proper_form,
            common_mistakes,
            tips,
            instructions,
            primary_muscles,
            secondary_muscles
          ),
        `)
        .eq('id', id)
        .single()
        .returns<Equipment>();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error fetching equipment by ID:', err);
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