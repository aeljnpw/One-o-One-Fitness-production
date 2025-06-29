import { useState, useEffect } from 'react';
import { supabase, Equipment } from '@/lib/supabase';

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
      
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setEquipment(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment');
    } finally {
      setLoading(false);
    }
  };

  return { equipment, loading, error, refetch: fetchEquipment };
}