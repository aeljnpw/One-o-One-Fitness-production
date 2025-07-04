/*
  # Complete Fitness App Database Schema

  1. New Tables
    - `equipment` - Fitness equipment catalog
    - `exercises` - Exercise library with detailed information
    - `workout_templates` - Predefined workout templates
    - `workout_template_exercises` - Junction table for template exercises
    - `workout_sessions` - User workout sessions
    - `exercise_sets` - Individual exercise sets within sessions
    - `daily_goals` - User daily fitness goals and progress
    - `nutrition_logs` - Food and nutrition tracking
    - `body_measurements` - Body measurement tracking
    - `progress_photos` - Progress photo storage
    - `user_achievements` - Achievement system
    - `user_favorites` - User favorites for exercises/workouts
    - `equipment_maintenance` - Equipment maintenance tracking

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for authenticated users
    - Ensure users can only access their own data

  3. Features
    - Comprehensive exercise library
    - Workout template system
    - Progress tracking
    - Nutrition logging
    - Achievement system
    - Equipment management
*/

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text,
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  muscle_group text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  type text,
  equipment text,
  thumbnail_url text,
  video_url text,
  proper_form text,
  common_mistakes text,
  tips text,
  title text,
  instructions text[],
  duration text,
  primary_muscles text[],
  secondary_muscles text[],
  equipment_id uuid REFERENCES equipment(id),
  created_at timestamptz DEFAULT now()
);

-- Workout templates table
CREATE TABLE IF NOT EXISTS workout_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  estimated_duration integer NOT NULL DEFAULT 30,
  target_muscles text[] DEFAULT '{}',
  equipment_needed text[] DEFAULT '{}',
  category text NOT NULL DEFAULT 'general',
  is_public boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Workout template exercises junction table
CREATE TABLE IF NOT EXISTS workout_template_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  sets integer NOT NULL DEFAULT 3,
  reps integer,
  duration integer,
  rest_time integer NOT NULL DEFAULT 60,
  notes text,
  UNIQUE(template_id, exercise_id, order_index)
);

-- Workout sessions table
CREATE TABLE IF NOT EXISTS workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id uuid REFERENCES workout_templates(id),
  name text NOT NULL,
  duration integer NOT NULL DEFAULT 0,
  calories_burned integer NOT NULL DEFAULT 0,
  notes text,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Exercise sets table
CREATE TABLE IF NOT EXISTS exercise_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_session_id uuid NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id),
  set_number integer NOT NULL DEFAULT 1,
  reps integer,
  weight numeric(5,2),
  duration integer,
  distance numeric(8,2),
  rest_time integer,
  notes text,
  completed_at timestamptz DEFAULT now()
);

-- Daily goals table
CREATE TABLE IF NOT EXISTS daily_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  calorie_goal integer NOT NULL DEFAULT 2000,
  exercise_minutes_goal integer NOT NULL DEFAULT 30,
  steps_goal integer NOT NULL DEFAULT 10000,
  water_goal integer NOT NULL DEFAULT 8,
  calories_burned integer NOT NULL DEFAULT 0,
  exercise_minutes integer NOT NULL DEFAULT 0,
  steps integer NOT NULL DEFAULT 0,
  water_consumed integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Nutrition logs table
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) DEFAULT 'breakfast',
  food_name text NOT NULL,
  calories integer NOT NULL DEFAULT 0,
  protein numeric(5,2) NOT NULL DEFAULT 0,
  carbs numeric(5,2) NOT NULL DEFAULT 0,
  fat numeric(5,2) NOT NULL DEFAULT 0,
  serving_size text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Body measurements table
CREATE TABLE IF NOT EXISTS body_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  measurement_date date NOT NULL DEFAULT CURRENT_DATE,
  weight numeric(5,2),
  body_fat_percentage numeric(4,2),
  muscle_mass numeric(5,2),
  chest numeric(5,2),
  waist numeric(5,2),
  hips numeric(5,2),
  bicep_left numeric(5,2),
  bicep_right numeric(5,2),
  thigh_left numeric(5,2),
  thigh_right numeric(5,2),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Progress photos table
CREATE TABLE IF NOT EXISTS progress_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  photo_type text NOT NULL CHECK (photo_type IN ('front', 'side', 'back', 'other')) DEFAULT 'front',
  taken_date date NOT NULL DEFAULT CURRENT_DATE,
  weight numeric(5,2),
  notes text,
  is_private boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  achievement_description text,
  target_value integer,
  current_value integer NOT NULL DEFAULT 0,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('exercise', 'workout', 'template')),
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Equipment maintenance table
CREATE TABLE IF NOT EXISTS equipment_maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  maintenance_type text NOT NULL CHECK (maintenance_type IN ('cleaning', 'repair', 'inspection', 'replacement')) DEFAULT 'cleaning',
  maintenance_date date NOT NULL DEFAULT CURRENT_DATE,
  description text,
  cost numeric(8,2),
  performed_by text,
  next_maintenance_date date,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;

-- Equipment policies (public read, admin write)
CREATE POLICY "Equipment is viewable by everyone" ON equipment FOR SELECT USING (true);
CREATE POLICY "Equipment is insertable by authenticated users" ON equipment FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Equipment is updatable by authenticated users" ON equipment FOR UPDATE TO authenticated USING (true);

-- Exercises policies (public read, admin write)
CREATE POLICY "Exercises are viewable by everyone" ON exercises FOR SELECT USING (true);
CREATE POLICY "Exercises are insertable by authenticated users" ON exercises FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Exercises are updatable by authenticated users" ON exercises FOR UPDATE TO authenticated USING (true);

-- Workout templates policies (public read for public templates, user write for own)
CREATE POLICY "Public workout templates are viewable by everyone" ON workout_templates FOR SELECT USING (is_public = true OR auth.uid() = created_by);
CREATE POLICY "Workout templates are insertable by authenticated users" ON workout_templates FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own workout templates" ON workout_templates FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own workout templates" ON workout_templates FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Workout template exercises policies
CREATE POLICY "Template exercises are viewable based on template access" ON workout_template_exercises FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM workout_templates 
    WHERE id = template_id 
    AND (is_public = true OR auth.uid() = created_by)
  )
);
CREATE POLICY "Template exercises are insertable by template owners" ON workout_template_exercises FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM workout_templates 
    WHERE id = template_id 
    AND auth.uid() = created_by
  )
);
CREATE POLICY "Template exercises are updatable by template owners" ON workout_template_exercises FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM workout_templates 
    WHERE id = template_id 
    AND auth.uid() = created_by
  )
);
CREATE POLICY "Template exercises are deletable by template owners" ON workout_template_exercises FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM workout_templates 
    WHERE id = template_id 
    AND auth.uid() = created_by
  )
);

-- Workout sessions policies (users can only access their own)
CREATE POLICY "Users can view their own workout sessions" ON workout_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own workout sessions" ON workout_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workout sessions" ON workout_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workout sessions" ON workout_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Exercise sets policies (users can only access their own through workout sessions)
CREATE POLICY "Users can view their own exercise sets" ON exercise_sets FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM workout_sessions 
    WHERE id = workout_session_id 
    AND auth.uid() = user_id
  )
);
CREATE POLICY "Users can insert their own exercise sets" ON exercise_sets FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM workout_sessions 
    WHERE id = workout_session_id 
    AND auth.uid() = user_id
  )
);
CREATE POLICY "Users can update their own exercise sets" ON exercise_sets FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM workout_sessions 
    WHERE id = workout_session_id 
    AND auth.uid() = user_id
  )
);
CREATE POLICY "Users can delete their own exercise sets" ON exercise_sets FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM workout_sessions 
    WHERE id = workout_session_id 
    AND auth.uid() = user_id
  )
);

-- Daily goals policies
CREATE POLICY "Users can view their own daily goals" ON daily_goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own daily goals" ON daily_goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own daily goals" ON daily_goals FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own daily goals" ON daily_goals FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Nutrition logs policies
CREATE POLICY "Users can view their own nutrition logs" ON nutrition_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own nutrition logs" ON nutrition_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nutrition logs" ON nutrition_logs FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own nutrition logs" ON nutrition_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Body measurements policies
CREATE POLICY "Users can view their own body measurements" ON body_measurements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own body measurements" ON body_measurements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own body measurements" ON body_measurements FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own body measurements" ON body_measurements FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Progress photos policies
CREATE POLICY "Users can view their own progress photos" ON progress_photos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress photos" ON progress_photos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress photos" ON progress_photos FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own progress photos" ON progress_photos FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own achievements" ON user_achievements FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own achievements" ON user_achievements FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- User favorites policies
CREATE POLICY "Users can view their own favorites" ON user_favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON user_favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own favorites" ON user_favorites FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON user_favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Equipment maintenance policies (public read, admin write)
CREATE POLICY "Equipment maintenance is viewable by everyone" ON equipment_maintenance FOR SELECT USING (true);
CREATE POLICY "Equipment maintenance is insertable by authenticated users" ON equipment_maintenance FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Equipment maintenance is updatable by authenticated users" ON equipment_maintenance FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Equipment maintenance is deletable by authenticated users" ON equipment_maintenance FOR DELETE TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment_id ON exercises(equipment_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_completed_at ON workout_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_workout_session_id ON exercise_sets(workout_session_id);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_exercise_id ON exercise_sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_daily_goals_user_id_date ON daily_goals(user_id, date);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_id_date ON nutrition_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_id_date ON body_measurements(user_id, measurement_date);
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_id_date ON progress_photos(user_id, taken_date);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_equipment_id ON equipment_maintenance(equipment_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workout_templates_updated_at BEFORE UPDATE ON workout_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workout_sessions_updated_at BEFORE UPDATE ON workout_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_goals_updated_at BEFORE UPDATE ON daily_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();