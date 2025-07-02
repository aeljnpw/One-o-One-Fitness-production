/*
  # Sample Data for Fitness App

  1. Equipment Data
    - 10 equipment items with real Pexels images
    - Various categories: weights, cardio, bodyweight, accessories, machines

  2. Exercise Data
    - 10+ exercises with detailed instructions and form tips
    - Proper relationships to equipment
    - Multiple difficulty levels and muscle groups

  3. Workout Templates
    - 5 workout templates covering different fitness levels
    - Proper exercise relationships and ordering

  4. Sample Relationships
    - Template exercises with sets, reps, and rest times
    - Equipment maintenance records
*/

-- Insert sample equipment
INSERT INTO equipment (id, name, description, image_url, category) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Dumbbells', 'Adjustable weight dumbbells for strength training exercises', 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=800', 'weights'),
('550e8400-e29b-41d4-a716-446655440002', 'Barbell', 'Olympic barbell for heavy compound movements', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800', 'weights'),
('550e8400-e29b-41d4-a716-446655440003', 'Treadmill', 'Cardio machine for running and walking workouts', 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800', 'cardio'),
('550e8400-e29b-41d4-a716-446655440004', 'Bench Press', 'Adjustable bench for various pressing exercises', 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800', 'weights'),
('550e8400-e29b-41d4-a716-446655440005', 'Pull-up Bar', 'Fixed bar for pull-ups and chin-ups', 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=800', 'bodyweight'),
('550e8400-e29b-41d4-a716-446655440006', 'Kettlebells', 'Cast iron kettlebells for functional training', 'https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg?auto=compress&cs=tinysrgb&w=800', 'weights'),
('550e8400-e29b-41d4-a716-446655440007', 'Resistance Bands', 'Elastic bands for resistance training', 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=800', 'accessories'),
('550e8400-e29b-41d4-a716-446655440008', 'Exercise Ball', 'Stability ball for core and balance training', 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800', 'accessories'),
('550e8400-e29b-41d4-a716-446655440009', 'Rowing Machine', 'Full-body cardio and strength machine', 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800', 'cardio'),
('550e8400-e29b-41d4-a716-446655440010', 'Cable Machine', 'Multi-station cable system for various exercises', 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=800', 'machines')
ON CONFLICT (id) DO NOTHING;

-- Insert sample exercises
INSERT INTO exercises (id, name, muscle_group, difficulty, type, equipment, thumbnail_url, proper_form, tips, instructions, primary_muscles, secondary_muscles, equipment_id) VALUES
-- Dumbbell exercises
('f2032ca3-c804-4c0d-9a18-291d81b232c7', 'Dumbbell Bench Press', 'Chest', 'intermediate', 'strength', 'Dumbbells', 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400', 'Lie flat on bench with dumbbells in each hand at chest level. Press weights up until arms are fully extended, then lower with control.', 'Keep your core engaged throughout the movement. Don''t arch your back excessively. Control the negative portion of the lift.', ARRAY['Lie flat on bench with dumbbells in each hand', 'Lower weights to chest level with control', 'Press weights up until arms are fully extended', 'Squeeze chest muscles at the top'], ARRAY['Chest', 'Pectorals'], ARRAY['Shoulders', 'Triceps'], '550e8400-e29b-41d4-a716-446655440001'),

('f2032ca3-c804-4c0d-9a18-291d81b232c8', 'Dumbbell Rows', 'Back', 'beginner', 'strength', 'Dumbbells', 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400', 'Hinge at hips with dumbbells in hands. Pull weights to ribcage, squeezing shoulder blades together.', 'Keep your core tight and back straight. Focus on pulling with your lats, not your arms.', ARRAY['Stand with feet hip-width apart, holding dumbbells', 'Hinge at hips, keeping back straight', 'Pull weights to your ribcage', 'Squeeze shoulder blades together'], ARRAY['Latissimus Dorsi', 'Rhomboids'], ARRAY['Biceps', 'Rear Delts'], '550e8400-e29b-41d4-a716-446655440001'),

('f2032ca3-c804-4c0d-9a18-291d81b232c9', 'Dumbbell Squats', 'Legs', 'beginner', 'strength', 'Dumbbells', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400', 'Hold dumbbells at sides or shoulders. Lower into squat position, keeping chest up and knees tracking over toes.', 'Go as low as your mobility allows. Drive through your heels to return to standing.', ARRAY['Hold dumbbells at shoulder level or sides', 'Stand with feet shoulder-width apart', 'Lower into squat position', 'Drive through heels to return to start'], ARRAY['Quadriceps', 'Glutes'], ARRAY['Hamstrings', 'Calves', 'Core'], '550e8400-e29b-41d4-a716-446655440001'),

-- Barbell exercises
('f2032ca3-c804-4c0d-9a18-291d81b232d0', 'Barbell Deadlift', 'Back', 'advanced', 'strength', 'Barbell', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400', 'Stand with feet hip-width apart, barbell over mid-foot. Hinge at hips and knees to grip bar. Drive through heels to stand up straight.', 'Keep the bar close to your body throughout the movement. Maintain a neutral spine. Engage your lats to keep the bar close.', ARRAY['Stand with feet hip-width apart', 'Hinge at hips and knees to grip barbell', 'Keep chest up and back straight', 'Drive through heels to stand up'], ARRAY['Hamstrings', 'Glutes', 'Erector Spinae'], ARRAY['Quadriceps', 'Traps', 'Forearms'], '550e8400-e29b-41d4-a716-446655440002'),

('f2032ca3-c804-4c0d-9a18-291d81b232d1', 'Barbell Squat', 'Legs', 'intermediate', 'strength', 'Barbell', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400', 'Position barbell on upper back. Stand with feet shoulder-width apart. Lower into squat, keeping chest up and knees tracking over toes.', 'Keep your core braced throughout. Don''t let knees cave inward. Descend until thighs are parallel to floor.', ARRAY['Position barbell on upper back', 'Stand with feet shoulder-width apart', 'Lower into squat position', 'Drive through heels to return to start'], ARRAY['Quadriceps', 'Glutes'], ARRAY['Hamstrings', 'Calves', 'Core'], '550e8400-e29b-41d4-a716-446655440002'),

-- Bodyweight exercises
('f2032ca3-c804-4c0d-9a18-291d81b232d2', 'Push-ups', 'Chest', 'beginner', 'bodyweight', 'None', 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400', 'Start in plank position with hands slightly wider than shoulders. Lower chest to floor, then push back up.', 'Keep your body in a straight line from head to heels. Don''t let hips sag or pike up.', ARRAY['Start in plank position', 'Lower chest toward floor', 'Push back up to starting position', 'Keep body in straight line'], ARRAY['Chest', 'Pectorals'], ARRAY['Shoulders', 'Triceps', 'Core'], NULL),

('f2032ca3-c804-4c0d-9a18-291d81b232d3', 'Pull-ups', 'Back', 'intermediate', 'bodyweight', 'Pull-up Bar', 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400', 'Hang from bar with overhand grip. Pull body up until chin clears bar, then lower with control.', 'Engage your lats and avoid swinging. Focus on pulling your elbows down and back.', ARRAY['Hang from bar with overhand grip', 'Pull body up until chin clears bar', 'Lower with control to full hang', 'Keep core engaged throughout'], ARRAY['Latissimus Dorsi', 'Rhomboids'], ARRAY['Biceps', 'Rear Delts'], '550e8400-e29b-41d4-a716-446655440005'),

('f2032ca3-c804-4c0d-9a18-291d81b232d4', 'Plank', 'Core', 'beginner', 'bodyweight', 'None', 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400', 'Hold plank position with forearms on ground and body in straight line from head to heels.', 'Keep hips level and core engaged. Breathe normally throughout the hold.', ARRAY['Start in forearm plank position', 'Keep body in straight line', 'Hold position for specified time', 'Breathe normally throughout'], ARRAY['Core', 'Abdominals'], ARRAY['Shoulders', 'Glutes'], NULL),

-- Kettlebell exercises
('f2032ca3-c804-4c0d-9a18-291d81b232d5', 'Kettlebell Swings', 'Full Body', 'intermediate', 'strength', 'Kettlebells', 'https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg?auto=compress&cs=tinysrgb&w=400', 'Stand with feet wider than shoulders, kettlebell between legs. Hinge at hips and swing kettlebell up to chest level using hip drive.', 'Power comes from your hips, not your arms. Keep core engaged and back straight throughout.', ARRAY['Stand with feet wider than shoulders', 'Hinge at hips with kettlebell between legs', 'Drive hips forward to swing kettlebell up', 'Let kettlebell swing back down between legs'], ARRAY['Glutes', 'Hamstrings'], ARRAY['Core', 'Shoulders', 'Quadriceps'], '550e8400-e29b-41d4-a716-446655440006'),

-- Cardio exercises
('f2032ca3-c804-4c0d-9a18-291d81b232d6', 'Treadmill Running', 'Cardio', 'beginner', 'cardio', 'Treadmill', 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=400', 'Maintain steady pace with proper running form. Land on midfoot, keep cadence around 180 steps per minute.', 'Start with comfortable pace and gradually increase intensity. Stay hydrated throughout workout.', ARRAY['Start with 5-minute warm-up walk', 'Gradually increase to running pace', 'Maintain steady rhythm', 'Cool down with 5-minute walk'], ARRAY['Cardiovascular System'], ARRAY['Legs', 'Core'], '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (id) DO NOTHING;

-- Insert sample workout templates
INSERT INTO workout_templates (id, name, description, difficulty, estimated_duration, target_muscles, equipment_needed, category, is_public, image_url) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Full Body Strength', 'A comprehensive strength training workout targeting all major muscle groups. Perfect for building lean muscle mass and improving overall strength.', 'intermediate', 45, ARRAY['Chest', 'Back', 'Legs', 'Arms', 'Core'], ARRAY['Dumbbells', 'Barbell', 'Bench'], 'strength', true, 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567891', 'Beginner Bodyweight', 'Perfect starter workout using only bodyweight exercises. Build strength and endurance without any equipment needed.', 'beginner', 30, ARRAY['Chest', 'Back', 'Legs', 'Core'], ARRAY[], 'bodyweight', true, 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=800'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567892', 'Upper Body Power', 'Intense upper body workout focusing on chest, back, and arms. Build strength and muscle definition in your upper body.', 'advanced', 50, ARRAY['Chest', 'Back', 'Arms', 'Shoulders'], ARRAY['Dumbbells', 'Barbell', 'Pull-up Bar'], 'strength', true, 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567893', 'Cardio Blast', 'High-intensity cardio workout to improve cardiovascular fitness and burn calories effectively.', 'intermediate', 25, ARRAY['Cardiovascular'], ARRAY['Treadmill'], 'cardio', true, 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567894', 'Functional Training', 'Functional movement patterns using kettlebells and bodyweight exercises for real-world strength.', 'intermediate', 40, ARRAY['Full Body', 'Core', 'Functional'], ARRAY['Kettlebells'], 'functional', true, 'https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT (id) DO NOTHING;

-- Insert workout template exercises
INSERT INTO workout_template_exercises (template_id, exercise_id, order_index, sets, reps, rest_time, notes) VALUES
-- Full Body Strength workout
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f2032ca3-c804-4c0d-9a18-291d81b232d1', 1, 3, 8, 90, 'Focus on proper form and full range of motion'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f2032ca3-c804-4c0d-9a18-291d81b232c7', 2, 3, 10, 75, 'Control the weight on the way down'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f2032ca3-c804-4c0d-9a18-291d81b232c8', 3, 3, 12, 60, 'Squeeze shoulder blades together'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f2032ca3-c804-4c0d-9a18-291d81b232d0', 4, 3, 6, 120, 'Keep the bar close to your body'),

-- Beginner Bodyweight workout
('a1b2c3d4-e5f6-7890-abcd-ef1234567891', 'f2032ca3-c804-4c0d-9a18-291d81b232d2', 1, 3, 10, 60, 'Modify on knees if needed'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567891', 'f2032ca3-c804-4c0d-9a18-291d81b232c9', 2, 3, 15, 45, 'Use bodyweight only'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567891', 'f2032ca3-c804-4c0d-9a18-291d81b232d4', 3, 3, 30, 45, 'Hold for 30 seconds each set'),

-- Upper Body Power workout
('a1b2c3d4-e5f6-7890-abcd-ef1234567892', 'f2032ca3-c804-4c0d-9a18-291d81b232c7', 1, 4, 8, 90, 'Use challenging weight'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567892', 'f2032ca3-c804-4c0d-9a18-291d81b232d3', 2, 4, 6, 120, 'Use assistance if needed'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567892', 'f2032ca3-c804-4c0d-9a18-291d81b232c8', 3, 4, 10, 75, 'Focus on lat engagement'),

-- Cardio Blast workout
('a1b2c3d4-e5f6-7890-abcd-ef1234567893', 'f2032ca3-c804-4c0d-9a18-291d81b232d6', 1, 1, NULL, 0, '25 minutes steady state or intervals'),

-- Functional Training workout
('a1b2c3d4-e5f6-7890-abcd-ef1234567894', 'f2032ca3-c804-4c0d-9a18-291d81b232d5', 1, 4, 20, 60, 'Focus on hip drive'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567894', 'f2032ca3-c804-4c0d-9a18-291d81b232d2', 2, 3, 15, 45, 'Maintain proper form'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567894', 'f2032ca3-c804-4c0d-9a18-291d81b232d4', 3, 3, 45, 60, 'Hold for 45 seconds')
ON CONFLICT DO NOTHING;

-- Insert sample equipment maintenance records
INSERT INTO equipment_maintenance (equipment_id, maintenance_type, maintenance_date, description, performed_by, next_maintenance_date) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'cleaning', '2024-01-15', 'Deep cleaning and sanitization of dumbbells', 'Maintenance Team', '2024-02-15'),
('550e8400-e29b-41d4-a716-446655440002', 'inspection', '2024-01-10', 'Safety inspection of barbell and plates', 'Safety Inspector', '2024-04-10'),
('550e8400-e29b-41d4-a716-446655440003', 'repair', '2024-01-20', 'Belt replacement and motor calibration', 'Technician', '2024-07-20'),
('550e8400-e29b-41d4-a716-446655440004', 'cleaning', '2024-01-12', 'Bench cleaning and padding inspection', 'Maintenance Team', '2024-02-12'),
('550e8400-e29b-41d4-a716-446655440005', 'inspection', '2024-01-08', 'Structural integrity check of pull-up bar', 'Safety Inspector', '2024-04-08')
ON CONFLICT DO NOTHING;