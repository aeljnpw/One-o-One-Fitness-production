import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle, RefreshCw } from 'lucide-react-native';
import { testConnection } from '@/lib/supabase';

interface DatabaseStatusProps {
  onRetry?: () => void;
}

export function DatabaseStatus({ onRetry }: DatabaseStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await testConnection();
      setIsConnected(connected);
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleRetry = () => {
    checkConnection();
    onRetry?.();
  };

  if (isConnected === null && !isChecking) {
    return null;
  }

  if (isConnected) {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <CheckCircle size={20} color="#059669" />
        <Text style={styles.successText}>Database Connected</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.errorContainer]}>
      <AlertCircle size={20} color="#EF4444" />
      <View style={styles.content}>
        <Text style={styles.errorTitle}>Database Connection Issue</Text>
        <Text style={styles.errorText}>
          {isChecking ? 'Checking connection...' : 'Unable to connect to database. Check your Supabase configuration.'}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={handleRetry}
        disabled={isChecking}
      >
        <RefreshCw size={16} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  successContainer: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    marginLeft: 8,
  },
  errorTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginBottom: 2,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
  },
  retryButton: {
    padding: 4,
  },
});