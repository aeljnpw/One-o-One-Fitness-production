/*
  # Sample Data for Fitness App

  1. Sample equipment
  2. Sample exercises
  3. Sample workout templates
  4. Link exercises to templates

  This provides initial data for testing the app.
*/

-- Insert sample equipment
INSERT INTO public.equipment (id, name, description, category, image_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Dumbbells', 'Adjustable weight dumbbells for strength training', 'Weights', 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Barbell', 'Olympic barbell for heavy compound movements', 'Weights', 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Bench', 'Adjustable workout bench for various exercises', 'Benches', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Pull-up Bar', 'Doorway pull-up bar for upper body exercises', 'Bodyweight', 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Resistance Bands', 'Set of resistance bands for strength and mobility', 'Accessories', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Kettlebell', 'Cast iron kettlebell for functional training', 'Weights', 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Yoga Mat', 'Non-slip yoga mat for floor exercises', 'Accessories', 'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Medicine Ball', 'Weighted medicine ball for core and power training', 'Weights', 'https://images.pexels.com/photos/1552238/pexels-photo-1552238.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2')
ON CONFLICT (id) DO NOTHING;

-- Insert sample exercises
INSERT INTO public.exercises (id, name, muscle_group, difficulty, type, equipment, equipment_id, thumbnail_url, proper_form, tips, instructions, primary_muscles, secondary_muscles) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'Dumbbell Bench Press', 'Chest', 'intermediate', 'strength', 'Dumbbells', '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Lie flat on bench, lower dumbbells to chest level with control, press up until arms are fully extended', 'Keep your core engaged and maintain a slight arch in your back', ARRAY['Lie flat on bench with dumbbells in each hand', 'Lower weights to chest level with control', 'Press weights up until arms are fully extended', 'Squeeze chest muscles at the top'], ARRAY['Chest', 'Pectorals'], ARRAY['Shoulders', 'Triceps']),
  
  ('650e8400-e29b-41d4-a716-446655440002', 'Bent-Over Rows', 'Back', 'intermediate', 'strength', 'Dumbbells', '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Hinge at hips with straight back, pull weights to ribcage, squeeze shoulder blades together', 'Keep your core tight and avoid rounding your back', ARRAY['Stand with feet hip-width apart holding dumbbells', 'Hinge at hips keeping back straight', 'Pull weights to your ribcage', 'Squeeze shoulder blades together'], ARRAY['Latissimus Dorsi', 'Rhomboids'], ARRAY['Biceps', 'Rear Delts']),
  
  ('650e8400-e29b-41d4-a716-446655440003', 'Goblet Squats', 'Legs', 'beginner', 'strength', 'Dumbbells', '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Hold dumbbell at chest, squat down keeping chest up, drive through heels to return', 'Go as low as your mobility allows and keep your knees tracking over your toes', ARRAY['Hold dumbbell at chest level', 'Stand with feet shoulder-width apart', 'Lower into squat position', 'Drive through heels to return to start'], ARRAY['Quadriceps', 'Glutes'], ARRAY['Core', 'Calves']),
  
  ('650e8400-e29b-41d4-a716-446655440004', 'Overhead Press', 'Shoulders', 'intermediate', 'strength', 'Dumbbells', '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Press dumbbells overhead from shoulder height, keep core engaged throughout movement', 'Avoid arching your back excessively and press in a straight line', ARRAY['Stand with dumbbells at shoulder height', 'Press weights overhead until arms are extended', 'Lower with control to starting position', 'Keep core engaged throughout'], ARRAY['Shoulders', 'Deltoids'], ARRAY['Triceps', 'Core']),
  
  ('650e8400-e29b-41d4-a716-446655440005', 'Romanian Deadlifts', 'Legs', 'intermediate', 'strength', 'Dumbbells', '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Hinge at hips lowering weights, feel stretch in hamstrings, drive hips forward to return', 'Keep the weights close to your body and maintain a neutral spine', ARRAY['Hold dumbbells in front of thighs', 'Hinge at hips lowering weights', 'Feel stretch in hamstrings', 'Drive hips forward to return to start'], ARRAY['Hamstrings', 'Glutes'], ARRAY['Lower Back', 'Core']),
  
  ('650e8400-e29b-41d4-a716-446655440006', 'Pull-ups', 'Back', 'advanced', 'bodyweight', 'Pull-up Bar', '550e8400-e29b-41d4-a716-446655440004', 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Hang from bar with arms extended, pull body up until chin clears bar, lower with control', 'Engage your lats and avoid swinging or using momentum', ARRAY['Hang from pull-up bar with arms extended', 'Pull your body up until chin clears the bar', 'Lower your body with control', 'Repeat for desired reps'], ARRAY['Latissimus Dorsi', 'Rhomboids'], ARRAY['Biceps', 'Rear Delts']),
  
  ('650e8400-e29b-41d4-a716-446655440007', 'Push-ups', 'Chest', 'beginner', 'bodyweight', 'None', NULL, 'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Start in plank position, lower chest to floor, push back up to starting position', 'Keep your body in a straight line and engage your core', ARRAY['Start in plank position with hands under shoulders', 'Lower your chest toward the floor', 'Push back up to starting position', 'Keep body in straight line throughout'], ARRAY['Chest', 'Pectorals'], ARRAY['Shoulders', 'Triceps', 'Core']),
  
  ('650e8400-e29b-41d4-a716-446655440008', 'Kettlebell Swings', 'Full Body', 'intermediate', 'cardio', 'Kettlebell', '550e8400-e29b-41d4-a716-446655440006', 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Hinge at hips, swing kettlebell between legs, drive hips forward to swing to shoulder height', 'Power comes from your hips, not your arms. Keep your core engaged', ARRAY['Stand with feet shoulder-width apart holding kettlebell', 'Hinge at hips and swing kettlebell between legs', 'Drive hips forward explosively', 'Swing kettlebell to shoulder height'], ARRAY['Glutes', 'Hamstrings'], ARRAY['Core', 'Shoulders', 'Cardio'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample workout templates
INSERT INTO public.workout_templates (id, name, description, difficulty, estimated_duration, target_muscles, equipment_needed, category, is_public, image_url) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'Full Body Strength', 'A comprehensive strength training workout targeting all major muscle groups', 'intermediate', 45, ARRAY['Chest', 'Back', 'Legs', 'Shoulders'], ARRAY['Dumbbells', 'Bench'], 'Strength', true, 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2'),
  
  ('750e8400-e29b-41d4-a716-446655440002', 'Upper Body Power', 'Focus on upper body strength and muscle building', 'intermediate', 35, ARRAY['Chest', 'Back', 'Shoulders', 'Arms'], ARRAY['Dumbbells', 'Pull-up Bar'], 'Strength', true, 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2'),
  
  ('750e8400-e29b-41d4-a716-446655440003', 'Beginner Bodyweight', 'Perfect starter workout using only bodyweight exercises', 'beginner', 25, ARRAY['Full Body'], ARRAY['Yoga Mat'], 'Bodyweight', true, 'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2'),
  
  ('750e8400-e29b-41d4-a716-446655440004', 'Kettlebell HIIT', 'High-intensity interval training with kettlebells', 'advanced', 30, ARRAY['Full Body', 'Cardio'], ARRAY['Kettlebell'], 'HIIT', true, 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2')
ON CONFLICT (id) DO NOTHING;

-- Link exercises to workout templates
INSERT INTO public.workout_template_exercises (template_id, exercise_id, order_index, sets, reps, rest_time) VALUES
  -- Full Body Strength workout
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 1, 3, 10, 90),  -- Dumbbell Bench Press
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 2, 3, 12, 90),  -- Bent-Over Rows
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', 3, 3, 15, 75),  -- Goblet Squats
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440004', 4, 3, 8, 90),   -- Overhead Press
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440005', 5, 3, 12, 75),  -- Romanian Deadlifts
  
  -- Upper Body Power workout
  ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 1, 4, 8, 120),  -- Dumbbell Bench Press
  ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440006', 2, 3, 6, 120),  -- Pull-ups
  ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440004', 3, 3, 10, 90),  -- Overhead Press
  ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 4, 3, 10, 90),  -- Bent-Over Rows
  
  -- Beginner Bodyweight workout
  ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440007', 1, 3, 10, 60),  -- Push-ups
  ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 2, 3, 12, 60),  -- Goblet Squats (bodyweight version)
  
  -- Kettlebell HIIT workout
  ('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440008', 1, 4, 20, 45)   -- Kettlebell Swings
ON CONFLICT DO NOTHING;