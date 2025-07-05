import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getSupabase } from '@/lib/supabase';
import { RefreshCw } from 'lucide-react-native';

interface TableStatus {
  name: string;
  readable: boolean;
  error?: string;
}

export function RLSTest() {
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const testTables = async () => {
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }

    const tables = ['equipment', 'exercises', 'workout_templates'];
    const statuses = await Promise.all(
      tables.map(async (table): Promise<TableStatus> => {
        try {
          console.log(`Testing RLS for ${table}...`);
          const { data, error } = await supabase
            .from(table)
            .select('*', { head: true, count: 'exact' });

          if (error) {
            console.error(`RLS test failed for ${table}:`, error);
            return {
              name: table,
              readable: false,
              error: error.message
            };
          }

          console.log(`RLS test passed for ${table}`);
          return {
            name: table,
            readable: true
          };
        } catch (err) {
          console.error(`Error testing ${table}:`, err);
          return {
            name: table,
            readable: false,
            error: err instanceof Error ? err.message : 'Unknown error'
          };
        }
      })
    );

    setTableStatuses(statuses);
    setLoading(false);
  };

  useEffect(() => {
    testTables();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RLS Policy Check</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={testTables}
          disabled={loading}
        >
          <RefreshCw size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {tableStatuses.map((status) => (
        <View key={status.name} style={styles.statusRow}>
          <Text style={styles.tableName}>{status.name}</Text>
          <View style={[
            styles.statusBadge,
            status.readable ? styles.successBadge : styles.errorBadge
          ]}>
            <Text style={[
              styles.statusText,
              status.readable ? styles.successText : styles.errorText
            ]}>
              {status.readable ? 'Accessible' : 'Blocked'}
            </Text>
          </View>
          {status.error && (
            <Text style={styles.errorMessage}>{status.error}</Text>
          )}
        </View>
      ))}
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  refreshButton: {
    padding: 8,
  },
  statusRow: {
    marginBottom: 12,
  },
  tableName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  successBadge: {
    backgroundColor: '#D1FAE5',
  },
  errorBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  successText: {
    color: '#059669',
  },
  errorText: {
    color: '#DC2626',
  },
  errorMessage: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
}); 