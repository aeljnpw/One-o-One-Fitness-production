import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getSupabase } from '@/lib/supabase';
import { RefreshCw } from 'lucide-react-native';

export function DatabaseStatus() {
  const [status, setStatus] = useState<{
    connected: boolean;
    tables: { name: string; count: number }[];
    error: string | null;
  }>({
    connected: false,
    tables: [],
    error: null
  });

  const checkDatabase = async () => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      // Test connection with a simple query
      const { data: tableInfo, error: tableError } = await supabase
        .from('equipment')
        .select('count', { count: 'exact' });

      if (tableError) {
        throw tableError;
      }

      // Get counts from main tables
      const tables = ['equipment', 'exercises', 'workout_templates'];
      const counts = await Promise.all(
        tables.map(async (table) => {
          const { count } = await supabase
            .from(table)
            .select('*', { count: 'exact' });
          return { name: table, count: count || 0 };
        })
      );

      setStatus({
        connected: true,
        tables: counts,
        error: null
      });
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  useEffect(() => {
    checkDatabase();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Database Status</Text>
        <TouchableOpacity onPress={checkDatabase} style={styles.refreshButton}>
          <RefreshCw size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <Text style={styles.label}>Connection:</Text>
          <Text style={[
            styles.value,
            { color: status.connected ? '#059669' : '#DC2626' }
          ]}>
            {status.connected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>

        {status.tables.map(table => (
          <View key={table.name} style={styles.statusRow}>
            <Text style={styles.label}>{table.name}:</Text>
            <Text style={styles.value}>{table.count} records</Text>
          </View>
        ))}

        {status.error && (
          <Text style={styles.error}>{status.error}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  refreshButton: {
    padding: 8,
  },
  statusContainer: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  error: {
    fontSize: 14,
    color: '#DC2626',
    marginTop: 8,
  },
});