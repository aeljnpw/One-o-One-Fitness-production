import { useEffect } from 'react';
import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function TabsLayout() {
  const { user, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return null;
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      {/* Add your tab screens here */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      {/* Add more tab screens as needed */}
    </Tabs>
  );
}