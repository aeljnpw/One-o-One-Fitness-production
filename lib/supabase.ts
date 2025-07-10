import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Database } from './types';

// Get environment variables from Expo Constants with fallbacks
const getEnvVar = (key: string): string => {
  // Try multiple sources for environment variables
  const sources = [
    Constants.expoConfig?.extra?.[key],
    Constants.manifest?.extra?.[key],
    Constants.manifest2?.extra?.[key],
    process.env[`EXPO_PUBLIC_${key.toUpperCase()}`],
    process.env[key.toUpperCase()],
  ];

  const value = sources.find(v => v && typeof v === 'string');
  
  if (!value) {
    console.warn(`⚠️ Environment variable ${key} is not set`);
  } else {
    console.log(`📝 ${key}: ✅ Found`);
  }
  
  return value || '';
};

// Get Supabase configuration
const supabaseUrl = getEnvVar('supabaseUrl') || getEnvVar('SUPABASE_URL');
const supabaseKey = getEnvVar('supabaseKey') || getEnvVar('SUPABASE_KEY') || getEnvVar('supabaseAnonKey');

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return url.includes('supabase.co') && !url.includes('placeholder');
  } catch {
    return false;
  }
};

// Validate key format (check for publishable key or JWT-like structure)
const isValidKey = (key: string) => {
  return key && key.length > 20 && !key.includes('placeholder') && 
    (key.startsWith('eyJ') || key.startsWith('sb_publishable_'));
};

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseKey || !isValidUrl(supabaseUrl) || !isValidKey(supabaseKey)) {
      console.error('❌ Supabase configuration is missing:', {
        url: !supabaseUrl ? '❌ Missing' : !isValidUrl(supabaseUrl) ? '❌ Invalid format' : '✅ Valid',
        key: !supabaseKey ? '❌ Missing' : !isValidKey(supabaseKey) ? '❌ Invalid format' : '✅ Valid',
        urlValue: supabaseUrl ? (supabaseUrl.includes('placeholder') ? 'Contains placeholder' : 'Set') : 'Not set',
        keyValue: supabaseKey ? (supabaseKey.includes('placeholder') ? 'Contains placeholder' : 'Set') : 'Not set'
      });
      
      console.warn('⚠️ Please update your .env file with valid Supabase credentials');
      console.warn('📝 Get your credentials from: https://app.supabase.com/project/your-project/settings/api');
      
      return null;
    }

    try {
      console.log('🔄 Initializing Supabase client...');
      
      supabaseInstance = createClient<Database>(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });

      console.log('✅ Supabase client initialized');
    } catch (error) {
      console.error('❌ Error initializing Supabase client:', error);
      supabaseInstance = null;
    }
  }
  return supabaseInstance;
};

export const supabase = getSupabase();

// Test database connection
export const testConnection = async () => {
  console.log('🔍 Testing database connection...');
  
  const client = getSupabase();
  if (!client) {
    console.error('❌ Cannot test connection: Supabase client not initialized');
    return false;
  }

  try {
    // Test with a simple query
    const { data, error } = await client
      .from('equipment')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('❌ Database connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection test successful');
    return true;
  } catch (err) {
    console.error('❌ Database connection test error:', err);
    return false;
  }
};

export type Equipment = Database['public']['Tables']['equipment']['Row'];
export type Exercise = Database['public']['Tables']['exercises']['Row'];
export type WorkoutTemplate = Database['public']['Tables']['workout_templates']['Row'];
export type WorkoutTemplateExercise = Database['public']['Tables']['workout_template_exercises']['Row'];
export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row'];
export type ExerciseSet = Database['public']['Tables']['exercise_sets']['Row'];
export type DailyGoal = Database['public']['Tables']['daily_goals']['Row'];
export type NutritionLog = Database['public']['Tables']['nutrition_logs']['Row'];
export type BodyMeasurement = Database['public']['Tables']['body_measurements']['Row'];
export type ProgressPhoto = Database['public']['Tables']['progress_photos']['Row'];
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row'];
export type UserFavorite = Database['public']['Tables']['user_favorites']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];