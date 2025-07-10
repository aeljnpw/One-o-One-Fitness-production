import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  // Redirect based on authentication status
  if (user) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/auth/sign-in" />;
  }
}