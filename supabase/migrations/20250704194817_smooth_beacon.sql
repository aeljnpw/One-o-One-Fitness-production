/*
  # Core Fitness App Tables

  1. Equipment table for gym equipment
  2. Exercises table for exercise library
  3. Workout templates and template exercises
  4. Workout sessions and exercise sets
  5. Daily goals tracking
  6. User favorites

  All tables include proper RLS and policies.
*/

-- Equipment table
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create policies for equipment
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipment is viewable by authenticated users" ON public.equipment
  FOR SELECT TO authenticated USING (true);

-- Exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  type TEXT,
  equipment TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  proper_form TEXT,
  common_mistakes TEXT,
  tips TEXT,
  instructions TEXT[],
  primary_muscles TEXT[],
  secondary_muscles TEXT[],
  equipment_id UUID REFERENCES public.equipment(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create policies for exercises
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercises are viewable by authenticated users" ON public.exercises
  FOR SELECT TO authenticated USING (true);

-- Workout templates table
CREATE TABLE IF NOT EXISTS public.workout_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  estimated_duration INTEGER NOT NULL DEFAULT 30,
  target_muscles TEXT[] DEFAULT '{}',
  equipment_needed TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'General',
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create policies for workout templates
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public workout templates are viewable by authenticated users" ON public.workout_templates
  FOR SELECT TO authenticated USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create workout templates" ON public.workout_templates
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own workout templates" ON public.workout_templates
  FOR UPDATE TO authenticated USING (created_by = auth.uid());

-- Workout template exercises junction table
CREATE TABLE IF NOT EXISTS public.workout_template_exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  sets INTEGER DEFAULT 3,
  reps INTEGER,
  duration INTEGER,
  rest_time INTEGER DEFAULT 60,
  notes TEXT
);

-- Enable RLS and create policies for workout template exercises
ALTER TABLE public.workout_template_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workout template exercises are viewable by authenticated users" ON public.workout_template_exercises
  FOR SELECT TO authenticated USING (true);

-- Workout sessions table
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  workout_id UUID REFERENCES public.workout_templates(id),
  name TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create policies for workout sessions
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout sessions" ON public.workout_sessions
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can create their own workout sessions" ON public.workout_sessions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own workout sessions" ON public.workout_sessions
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Exercise sets table
CREATE TABLE IF NOT EXISTS public.exercise_sets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workout_session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id),
  set_number INTEGER NOT NULL,
  reps INTEGER,
  weight DECIMAL,
  duration INTEGER,
  distance DECIMAL,
  rest_time INTEGER,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create policies for exercise sets
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exercise sets" ON public.exercise_sets
  FOR SELECT TO authenticated USING (
    workout_session_id IN (
      SELECT id FROM public.workout_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own exercise sets" ON public.exercise_sets
  FOR INSERT TO authenticated WITH CHECK (
    workout_session_id IN (
      SELECT id FROM public.workout_sessions WHERE user_id = auth.uid()
    )
  );

-- Daily goals table
CREATE TABLE IF NOT EXISTS public.daily_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  date DATE DEFAULT CURRENT_DATE,
  calorie_goal INTEGER DEFAULT 2000,
  exercise_minutes_goal INTEGER DEFAULT 30,
  steps_goal INTEGER DEFAULT 10000,
  water_goal INTEGER DEFAULT 8,
  calories_burned INTEGER DEFAULT 0,
  exercise_minutes INTEGER DEFAULT 0,
  steps INTEGER DEFAULT 0,
  water_consumed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS and create policies for daily goals
ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily goals" ON public.daily_goals
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can create their own daily goals" ON public.daily_goals
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own daily goals" ON public.daily_goals
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- User favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  item_type TEXT NOT NULL CHECK (item_type IN ('exercise', 'workout', 'template')),
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- Enable RLS and create policies for user favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" ON public.user_favorites
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can create their own favorites" ON public.user_favorites
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own favorites" ON public.user_favorites
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Add updated_at triggers for tables that need them
CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_templates_updated_at
  BEFORE UPDATE ON public.workout_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at
  BEFORE UPDATE ON public.workout_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_goals_updated_at
  BEFORE UPDATE ON public.daily_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();