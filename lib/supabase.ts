import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get environment variables from Expo Constants
const getEnvVar = (key: string): string => {
  const value = Constants.expoConfig?.extra?.[key] || process.env[`EXPO_PUBLIC_${key}`];
  if (!value) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || '';
};

// Get Supabase configuration
const supabaseUrl = getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY');

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase configuration is missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables or app.config.js');
      console.log('Current config:', { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey });
      return null;
    }
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });
      console.log('Supabase client initialized successfully');
      console.log('Supabase URL:', supabaseUrl);
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
      return null;
    }
  }
  return supabaseInstance;
};

export const supabase = getSupabase();

// Test database connection
export const testConnection = async () => {
  const client = getSupabase();
  if (!client) {
    console.error('Cannot test connection: Supabase client not initialized');
    return false;
  }

  try {
    console.log('Testing database connection...');
    const { data, error } = await client
      .from('equipment')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }

    console.log('Database connection test successful');
    return true;
  } catch (err) {
    console.error('Database connection test error:', err);
    return false;
  }
};

export type Database = {
  public: {
    Tables: {
      equipment: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string | null;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image_url?: string | null;
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string | null;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          muscle_group: string;
          difficulty: string;
          type: string | null;
          equipment: string | null;
          thumbnail_url: string | null;
          video_url: string | null;
          proper_form: string | null;
          common_mistakes: string | null;
          tips: string | null;
          title: string | null;
          instructions: string[] | null;
          duration: string | null;
          primary_muscles: string[] | null;
          secondary_muscles: string[] | null;
          created_at: string;
          equipment_id: string | null;
        };
      workout_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          estimated_duration: number;
          target_muscles: string[];
          equipment_needed: string[];
          category: string;
          is_public: boolean;
          created_by: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          estimated_duration: number;
          target_muscles?: string[];
          equipment_needed?: string[];
          category?: string;
          is_public?: boolean;
          created_by?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          estimated_duration?: number;
          target_muscles?: string[];
          equipment_needed?: string[];
          category?: string;
          is_public?: boolean;
          created_by?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workout_template_exercises: {
        Row: {
          id: string;
          template_id: string;
          exercise_id: string;
          order_index: number;
          sets: number;
          reps: number | null;
          duration: number | null;
          rest_time: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          template_id: string;
          exercise_id: string;
          order_index: number;
          sets?: number;
          reps?: number | null;
          duration?: number | null;
          rest_time?: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          template_id?: string;
          exercise_id?: string;
          order_index?: number;
          sets?: number;
          reps?: number | null;
          duration?: number | null;
          rest_time?: number;
          notes?: string | null;
        };
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string | null;
          name: string;
          duration: number;
          calories_burned: number;
          notes: string | null;
          completed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          workout_id?: string | null;
          name: string;
          duration?: number;
          calories_burned?: number;
          notes?: string | null;
          completed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_id?: string | null;
          name?: string;
          duration?: number;
          calories_burned?: number;
          notes?: string | null;
          completed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercise_sets: {
        Row: {
          id: string;
          workout_session_id: string;
          exercise_id: string;
          set_number: number;
          reps: number | null;
          weight: number | null;
          duration: number | null;
          distance: number | null;
          rest_time: number | null;
          notes: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          workout_session_id: string;
          exercise_id: string;
          set_number: number;
          reps?: number | null;
          weight?: number | null;
          duration?: number | null;
          distance?: number | null;
          rest_time?: number | null;
          notes?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          workout_session_id?: string;
          exercise_id?: string;
          set_number?: number;
          reps?: number | null;
          weight?: number | null;
          duration?: number | null;
          distance?: number | null;
          rest_time?: number | null;
          notes?: string | null;
          completed_at?: string | null;
        };
      };
      daily_goals: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          calorie_goal: number;
          exercise_minutes_goal: number;
          steps_goal: number;
          water_goal: number;
          calories_burned: number;
          exercise_minutes: number;
          steps: number;
          water_consumed: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          calorie_goal?: number;
          exercise_minutes_goal?: number;
          steps_goal?: number;
          water_goal?: number;
          calories_burned?: number;
          exercise_minutes?: number;
          steps?: number;
          water_consumed?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          calorie_goal?: number;
          exercise_minutes_goal?: number;
          steps_goal?: number;
          water_goal?: number;
          calories_burned?: number;
          exercise_minutes?: number;
          steps?: number;
          water_consumed?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      nutrition_logs: {
        Row: {
          id: string;
          user_id: string;
          log_date: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          food_name: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          serving_size: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          log_date?: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          food_name: string;
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
          serving_size?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          log_date?: string;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          food_name?: string;
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
          serving_size?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      body_measurements: {
        Row: {
          id: string;
          user_id: string;
          measurement_date: string;
          weight: number | null;
          body_fat_percentage: number | null;
          muscle_mass: number | null;
          chest: number | null;
          waist: number | null;
          hips: number | null;
          bicep_left: number | null;
          bicep_right: number | null;
          thigh_left: number | null;
          thigh_right: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          measurement_date?: string;
          weight?: number | null;
          body_fat_percentage?: number | null;
          muscle_mass?: number | null;
          chest?: number | null;
          waist?: number | null;
          hips?: number | null;
          bicep_left?: number | null;
          bicep_right?: number | null;
          thigh_left?: number | null;
          thigh_right?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          measurement_date?: string;
          weight?: number | null;
          body_fat_percentage?: number | null;
          muscle_mass?: number | null;
          chest?: number | null;
          waist?: number | null;
          hips?: number | null;
          bicep_left?: number | null;
          bicep_right?: number | null;
          thigh_left?: number | null;
          thigh_right?: number | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      progress_photos: {
        Row: {
          id: string;
          user_id: string;
          photo_url: string;
          photo_type: 'front' | 'side' | 'back' | 'other';
          taken_date: string;
          weight: number | null;
          notes: string | null;
          is_private: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          photo_url: string;
          photo_type: 'front' | 'side' | 'back' | 'other';
          taken_date?: string;
          weight?: number | null;
          notes?: string | null;
          is_private?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          photo_url?: string;
          photo_type?: 'front' | 'side' | 'back' | 'other';
          taken_date?: string;
          weight?: number | null;
          notes?: string | null;
          is_private?: boolean;
          created_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_type: string;
          achievement_name: string;
          achievement_description: string | null;
          target_value: number | null;
          current_value: number;
          is_completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_type: string;
          achievement_name: string;
          achievement_description?: string | null;
          target_value?: number | null;
          current_value?: number;
          is_completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_type?: string;
          achievement_name?: string;
          achievement_description?: string | null;
          target_value?: number | null;
          current_value?: number;
          is_completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          item_type: 'exercise' | 'workout' | 'template';
          item_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_type: 'exercise' | 'workout' | 'template';
          item_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_type?: 'exercise' | 'workout' | 'template';
          item_id?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          bio: string | null;
          created_at: string;
          name: string | null;
          avatar_url: string | null;
          level: string;
          workouts_completed: number;
          total_calories: number;
          current_streak: number;
          longest_streak: number;
          email: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          bio?: string | null;
          created_at?: string;
          name?: string | null;
          avatar_url?: string | null;
          level?: string;
          workouts_completed?: number;
          total_calories?: number;
          current_streak?: number;
          longest_streak?: number;
          email?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bio?: string | null;
          created_at?: string;
          name?: string | null;
          avatar_url?: string | null;
          level?: string;
          workouts_completed?: number;
          total_calories?: number;
          current_streak?: number;
          longest_streak?: number;
          email?: string | null;
          updated_at?: string;
        };
      };
    };
  };
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