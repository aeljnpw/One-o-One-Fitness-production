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
    };
  };
};

export type Equipment = Database['public']['Tables']['equipment']['Row'];
export type Exercise = Database['public']['Tables']['exercises']['Row'];