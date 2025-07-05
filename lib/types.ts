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