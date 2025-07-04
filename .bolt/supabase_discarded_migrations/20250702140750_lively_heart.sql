/*
  # Fix profiles table schema

  1. Changes
    - Remove redundant `user_id` column from `profiles` table
    - The `id` column should directly store the user's ID from `auth.users`
    - Update foreign key constraint to reference `auth.users(id)` directly

  2. Security
    - Maintain existing RLS policies
    - Ensure proper user access control
*/

-- Remove the redundant user_id column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'user_id'
  ) THEN
    -- Drop the foreign key constraint first
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
    
    -- Drop the user_id column
    ALTER TABLE profiles DROP COLUMN user_id;
  END IF;
END $$;

-- Ensure the id column references auth.users(id)
DO $$
BEGIN
  -- Drop existing foreign key constraint on id if it exists
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
  
  -- Add the correct foreign key constraint
  ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;