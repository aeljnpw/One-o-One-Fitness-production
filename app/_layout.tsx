import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { getSupabase } from '@/lib/supabase';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/sign-in');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          // Create or update user profile
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || null,
              updated_at: new Date().toISOString(),
            });
          
          if (error) {
            console.error('Error creating/updating profile:', error);
          }
          
          router.replace('/(tabs)');
        } else if (event === 'SIGNED_OUT') {
          router.replace('/auth/sign-in');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const hideSplash = async () => {
      try {
        console.log('Attempting to hide splash screen...');
        await SplashScreen.hideAsync();
        console.log('Splash screen hidden successfully');
      } catch (error) {
        console.error('Error hiding splash screen:', error);
      }
    };

    if (fontsLoaded || fontError) {
      console.log('Fonts loaded:', fontsLoaded, 'Font error:', !!fontError);
      hideSplash();
    }
  }, [fontsLoaded, fontError]);

  // Return loading placeholder
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Return error screen if font loading failed
  if (fontError) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Error loading fonts. Platform: {Platform.OS}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}