import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        Insert: {
          id?: string;
          name: string;
          muscle_group: string;
          difficulty: string;
          type?: string | null;
          equipment?: string | null;
          thumbnail_url?: string | null;
          video_url?: string | null;
          proper_form?: string | null;
          common_mistakes?: string | null;
          tips?: string | null;
          title?: string | null;
          instructions?: string[] | null;
          duration?: string | null;
          primary_muscles?: string[] | null;
          secondary_muscles?: string[] | null;
          created_at?: string;
          equipment_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          muscle_group?: string;
          difficulty?: string;
          type?: string | null;
          equipment?: string | null;
          thumbnail_url?: string | null;
          video_url?: string | null;
          proper_form?: string | null;
          common_mistakes?: string | null;
          tips?: string | null;
          title?: string | null;
          instructions?: string[] | null;
          duration?: string | null;
          primary_muscles?: string[] | null;
          secondary_muscles?: string[] | null;
          created_at?: string;
          equipment_id?: string | null;
        };
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
    };
  };
};

export type Equipment = Database['public']['Tables']['equipment']['Row'];
export type Exercise = Database['public']['Tables']['exercises']['Row'];
export type WorkoutTemplate = Database['public']['Tables']['workout_templates']['Row'];
export type WorkoutTemplateExercise = Database['public']['Tables']['workout_template_exercises']['Row'];
export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row'];
export type ExerciseSet = Database['public']['Tables']['exercise_sets']['Row'];