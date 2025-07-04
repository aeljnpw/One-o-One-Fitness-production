/*
  # Sample Data for Fitness App

  This migration inserts sample data to populate the database with realistic content
  for testing and development purposes.
  
  ## Data Inserted:
  1. Equipment - Various fitness equipment
  2. Exercises - Exercise library with proper form instructions
  3. Workout Templates - Sample workout routines
  4. Template Exercises - Links exercises to templates
*/

-- Insert sample equipment
INSERT INTO equipment (id, name, description, category, image_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Dumbbells', 'Adjustable weight dumbbells for strength training', 'Weights', 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Barbell', 'Olympic barbell for heavy compound movements', 'Weights', 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Bench', 'Adjustable workout bench for various exercises', 'Benches', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Kettlebell', 'Cast iron kettlebell for functional training', 'Weights', 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Resistance Bands', 'Elastic resistance bands for strength and mobility', 'Accessories', 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Pull-up Bar', 'Doorway pull-up bar for upper body training', 'Bars', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Yoga Mat', 'Non-slip yoga mat for floor exercises and stretching', 'Accessories', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Medicine Ball', 'Weighted medicine ball for core and functional training', 'Weights', 'https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2');

-- Insert sample exercises
INSERT INTO exercises (id, name, muscle_group, difficulty, type, equipment, equipment_id, thumbnail_url, proper_form, common_mistakes, tips, instructions, primary_muscles, secondary_muscles) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'Dumbbell Bench Press', 'Chest', 'intermediate', 'Strength', 'Dumbbells', '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Lie flat on bench with dumbbells in each hand at chest level. Press weights up until arms are fully extended, then lower with control.', 'Arching back excessively, bouncing weights off chest, not controlling the negative movement.', 'Keep your core engaged throughout the movement. Focus on squeezing your chest muscles at the top of the movement.', ARRAY['Lie flat on bench with dumbbells in each hand', 'Lower weights to chest level with control', 'Press weights up until arms are fully extended', 'Squeeze chest muscles at the top'], ARRAY['Chest', 'Pectorals'], ARRAY['Shoulders', 'Triceps']),
  
  ('650e8400-e29b-41d4-a716-446655440002', 'Bent-Over Dumbbell Rows', 'Back', 'intermediate', 'Strength', 'Dumbbells', '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Stand with feet hip-width apart, holding dumbbells. Hinge at hips keeping back straight. Pull weights to your ribcage, squeezing shoulder blades together.', 'Rounding the back, using momentum, not squeezing shoulder blades together.', 'Keep your core tight and focus on pulling with your back muscles, not your arms.', ARRAY['Stand with feet hip-width apart, holding dumbbells', 'Hinge at hips, keeping back straight', 'Pull weights to your ribcage', 'Squeeze shoulder blades together'], ARRAY['Latissimus Dorsi', 'Rhomboids'], ARRAY['Biceps', 'Rear Delts']),
  
  ('650e8400-e29b-41d4-a716-446655440003', 'Goblet Squats', 'Legs', 'beginner', 'Strength', 'Dumbbells', '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Hold dumbbell at chest level with both hands. Stand with feet shoulder-width apart. Lower into squat position, then drive through heels to return to start.', 'Knees caving inward, not going deep enough, leaning too far forward.', 'Keep your chest up and go as low as your mobility allows. Drive through your heels on the way up.', ARRAY['Hold dumbbell at chest level', 'Stand with feet shoulder-width apart', 'Lower into squat position', 'Drive through heels to return to start'], ARRAY['Quadriceps', 'Glutes'], ARRAY['Core', 'Calves']),
  
  ('650e8400-e29b-41d4-a716-446655440004', 'Overhead Press', 'Shoulders', 'intermediate', 'Strength', 'Dumbbells', '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Stand with dumbbells at shoulder height. Press weights overhead until arms are extended. Lower with control to starting position. Keep core engaged throughout.', 'Arching the back, pressing forward instead of straight up, not engaging core.', 'Keep your core tight and press the weights in a straight line overhead.', ARRAY['Stand with dumbbells at shoulder height', 'Press weights overhead until arms are extended', 'Lower with control to starting position', 'Keep core engaged throughout'], ARRAY['Shoulders', 'Deltoids'], ARRAY['Triceps', 'Core']),
  
  ('650e8400-e29b-41d4-a716-446655440005', 'Romanian Deadlifts', 'Legs', 'intermediate', 'Strength', 'Dumbbells', '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Hold dumbbells in front of thighs. Hinge at hips, lowering weights while feeling stretch in hamstrings. Drive hips forward to return to start.', 'Rounding the back, bending knees too much, not feeling the stretch in hamstrings.', 'Keep the weights close to your body and focus on the hip hinge movement.', ARRAY['Hold dumbbells in front of thighs', 'Hinge at hips, lowering weights', 'Feel stretch in hamstrings', 'Drive hips forward to return to start'], ARRAY['Hamstrings', 'Glutes'], ARRAY['Lower Back', 'Core']),
  
  ('650e8400-e29b-41d4-a716-446655440006', 'Kettlebell Swings', 'Full Body', 'intermediate', 'Cardio', 'Kettlebell', '550e8400-e29b-41d4-a716-446655440004', 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Stand with feet wider than shoulder-width, holding kettlebell with both hands. Hinge at hips and swing kettlebell between legs, then drive hips forward to swing to chest height.', 'Using arms to lift the weight, squatting instead of hinging, swinging too high.', 'This is a hip-driven movement. Focus on the explosive hip drive to propel the kettlebell.', ARRAY['Stand with feet wider than shoulder-width', 'Hold kettlebell with both hands', 'Hinge at hips and swing kettlebell between legs', 'Drive hips forward to swing to chest height'], ARRAY['Glutes', 'Hamstrings'], ARRAY['Core', 'Shoulders']),
  
  ('650e8400-e29b-41d4-a716-446655440007', 'Pull-ups', 'Back', 'advanced', 'Strength', 'Pull-up Bar', '550e8400-e29b-41d4-a716-446655440006', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Hang from pull-up bar with hands slightly wider than shoulder-width. Pull your body up until chin clears the bar, then lower with control.', 'Using momentum, not going full range of motion, gripping too wide or too narrow.', 'Focus on pulling with your back muscles and squeezing your shoulder blades together.', ARRAY['Hang from pull-up bar with hands slightly wider than shoulder-width', 'Pull your body up until chin clears the bar', 'Lower with control to starting position', 'Maintain tight core throughout'], ARRAY['Latissimus Dorsi', 'Rhomboids'], ARRAY['Biceps', 'Rear Delts']),
  
  ('650e8400-e29b-41d4-a716-446655440008', 'Push-ups', 'Chest', 'beginner', 'Strength', 'Bodyweight', null, 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Start in plank position with hands slightly wider than shoulders. Lower body until chest nearly touches ground, then push back up to starting position.', 'Sagging hips, not going full range of motion, flaring elbows too wide.', 'Keep your body in a straight line from head to heels. Engage your core throughout the movement.', ARRAY['Start in plank position with hands slightly wider than shoulders', 'Lower body until chest nearly touches ground', 'Push back up to starting position', 'Keep body in straight line throughout'], ARRAY['Chest', 'Pectorals'], ARRAY['Shoulders', 'Triceps', 'Core']),
  
  ('650e8400-e29b-41d4-a716-446655440009', 'Plank', 'Core', 'beginner', 'Isometric', 'Bodyweight', null, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Start in push-up position but rest on forearms. Keep body in straight line from head to heels. Hold position while breathing normally.', 'Sagging hips, raising hips too high, holding breath.', 'Focus on keeping your core tight and maintaining a neutral spine throughout the hold.', ARRAY['Start in push-up position but rest on forearms', 'Keep body in straight line from head to heels', 'Hold position while breathing normally', 'Engage core muscles throughout'], ARRAY['Core', 'Abdominals'], ARRAY['Shoulders', 'Glutes']),
  
  ('650e8400-e29b-41d4-a716-446655440010', 'Medicine Ball Slams', 'Full Body', 'intermediate', 'Cardio', 'Medicine Ball', '550e8400-e29b-41d4-a716-446655440008', 'https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', 'Hold medicine ball overhead with both hands. Slam ball down to ground with maximum force, using your entire body. Pick up and repeat.', 'Not using full body, not slamming with enough force, poor ball selection.', 'Use your entire body in the movement - from your core to your arms. This is an explosive movement.', ARRAY['Hold medicine ball overhead with both hands', 'Slam ball down to ground with maximum force', 'Use your entire body in the movement', 'Pick up ball and repeat'], ARRAY['Core', 'Shoulders'], ARRAY['Back', 'Legs']);

-- Insert sample workout templates
INSERT INTO workout_templates (id, name, description, difficulty, estimated_duration, target_muscles, equipment_needed, category, is_public, image_url) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'Full Body Strength Training', 'A comprehensive strength training workout targeting all major muscle groups. Perfect for building lean muscle mass and improving overall strength.', 'intermediate', 45, ARRAY['Chest', 'Back', 'Legs', 'Arms', 'Core'], ARRAY['Dumbbells', 'Bench'], 'strength', true, 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2'),
  
  ('750e8400-e29b-41d4-a716-446655440002', 'Beginner Bodyweight Circuit', 'A beginner-friendly workout using only bodyweight exercises. Great for building foundational strength and endurance.', 'beginner', 30, ARRAY['Full Body', 'Core', 'Chest', 'Legs'], ARRAY['Yoga Mat'], 'bodyweight', true, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2'),
  
  ('750e8400-e29b-41d4-a716-446655440003', 'HIIT Cardio Blast', 'High-intensity interval training workout for maximum calorie burn and cardiovascular improvement.', 'advanced', 25, ARRAY['Full Body', 'Core', 'Cardio'], ARRAY['Kettlebell', 'Medicine Ball'], 'cardio', true, 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2'),
  
  ('750e8400-e29b-41d4-a716-446655440004', 'Upper Body Power', 'Focused upper body workout for building strength and muscle in chest, back, shoulders, and arms.', 'intermediate', 40, ARRAY['Chest', 'Back', 'Shoulders', 'Arms'], ARRAY['Dumbbells', 'Pull-up Bar', 'Bench'], 'strength', true, 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2');

-- Insert workout template exercises
INSERT INTO workout_template_exercises (template_id, exercise_id, order_index, sets, reps, rest_time, notes) VALUES
  -- Full Body Strength Training
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 1, 3, 10, 90, 'Focus on controlled movement'),
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 2, 3, 12, 75, 'Squeeze shoulder blades'),
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', 3, 3, 15, 60, 'Go as deep as comfortable'),
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440004', 4, 3, 8, 90, 'Keep core engaged'),
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440005', 5, 3, 12, 75, 'Feel the stretch'),
  
  -- Beginner Bodyweight Circuit
  ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440008', 1, 3, 10, 45, 'Modify on knees if needed'),
  ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', 2, 3, 12, 45, 'Use bodyweight only'),
  ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440009', 3, 3, 30, 60, 'Hold for 30 seconds'),
  
  -- HIIT Cardio Blast
  ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440006', 1, 4, 20, 30, 'Explosive movement'),
  ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440010', 2, 4, 15, 30, 'Maximum intensity'),
  ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440008', 3, 4, 15, 30, 'Fast tempo'),
  
  -- Upper Body Power
  ('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', 1, 4, 8, 120, 'Heavy weight, low reps'),
  ('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440007', 2, 4, 6, 120, 'Assisted if needed'),
  ('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', 3, 4, 10, 90, 'Controlled movement'),
  ('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002', 4, 4, 12, 75, 'Focus on form');