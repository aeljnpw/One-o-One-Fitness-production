import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from './types';

// Get environment variables from Expo Constants
const getEnvVar = (key: string): string => {
  const value = Constants.expoConfig?.extra?.[key];
  if (!value) {
    console.warn(`⚠️ Environment variable ${key} is not set`);
  }
  console.log(`📝 ${key}:`, value ? '✅ Found' : '❌ Missing');
  return value || '';
};

// Get Supabase configuration
const supabaseUrl = getEnvVar('supabaseUrl');
const supabaseAnonKey = getEnvVar('supabaseKey');

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase configuration is missing:', {
        url: supabaseUrl ? '✅ Set' : '❌ Missing',
        key: supabaseAnonKey ? '✅ Set' : '❌ Missing'
      });
      return null;
    }

    try {
      console.log('🔄 Initializing Supabase client...');
      console.log('🌐 URL:', supabaseUrl);
      
      // Create client with basic config first
      supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false, // Don't persist session for now
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });

      // Test the connection immediately
      void (async () => {
        try {
          console.log('🔍 Testing initial connection...');
          const { data, error } = await supabaseInstance!
            .from('equipment')
            .select('*')
            .limit(1);
          
          if (error) {
            console.error('❌ Initial connection test failed:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            supabaseInstance = null;
          } else {
            console.log('✅ Initial connection test successful, data:', data);
          }
        } catch (error: unknown) {
          console.error('❌ Connection test error:', {
            error: error instanceof Error ? {
              message: error.message,
              stack: error.stack
            } : error
          });
          supabaseInstance = null;
        }
      })();

      console.log('✅ Supabase client initialized');
    } catch (error) {
      console.error('❌ Error initializing Supabase client:', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error
      });
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
    // Only test essential tables
    const tables = ['equipment', 'exercises', 'workout_templates'] as const;
    const results = await Promise.all(
      tables.map(async (table) => {
        console.log(`📊 Testing access to ${table} table...`);
        const { data, error } = await client
          .from(table)
          .select('*')
          .limit(1);
          
        if (error) {
          console.error(`❌ Error accessing ${table}:`, error.message);
          return { table, success: false, error: error.message };
        }
        
        console.log(`✅ Successfully accessed ${table} table, data:`, data);
        return { table, success: true, data };
      })
    );

    const allSuccessful = results.every(r => r.success);
    if (allSuccessful) {
      console.log('✅ All table access tests passed');
    } else {
      console.error('❌ Some table access tests failed:', 
        results.filter(r => !r.success).map(r => r.table).join(', ')
      );
    }

    return allSuccessful;
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