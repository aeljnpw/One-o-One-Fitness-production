/*
  # Add Sample Equipment Data

  1. Purpose
    - Add sample equipment data to test the application
    - Ensure the equipment table has data to display

  2. Sample Data
    - Various types of gym equipment
    - Different categories for testing filters
    - Realistic descriptions and categories
*/

-- Insert sample equipment data
INSERT INTO equipment (name, description, image_url, category) VALUES
  (
    'Dumbbells',
    'Adjustable dumbbells perfect for strength training and muscle building exercises.',
    'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    'Free Weights'
  ),
  (
    'Barbell',
    'Olympic barbell for heavy compound movements like squats, deadlifts, and bench press.',
    'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    'Free Weights'
  ),
  (
    'Treadmill',
    'High-quality treadmill for cardio workouts, running, and walking exercises.',
    'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    'Cardio'
  ),
  (
    'Pull-up Bar',
    'Sturdy pull-up bar for upper body strength training and bodyweight exercises.',
    'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    'Bodyweight'
  ),
  (
    'Kettlebell',
    'Cast iron kettlebell for functional training, HIIT workouts, and strength building.',
    'https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    'Free Weights'
  ),
  (
    'Resistance Bands',
    'Set of resistance bands with varying resistance levels for strength and rehabilitation.',
    'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    'Accessories'
  ),
  (
    'Exercise Bike',
    'Stationary exercise bike for low-impact cardio workouts and endurance training.',
    'https://images.pexels.com/photos/7031706/pexels-photo-7031706.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    'Cardio'
  ),
  (
    'Yoga Mat',
    'Non-slip yoga mat perfect for yoga, pilates, stretching, and floor exercises.',
    'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    'Accessories'
  ),
  (
    'Medicine Ball',
    'Weighted medicine ball for core training, plyometric exercises, and functional movements.',
    'https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    'Free Weights'
  ),
  (
    'Bench Press',
    'Adjustable bench for bench press, incline press, and various dumbbell exercises.',
    'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    'Machines'
  );