/*
  # Remove Equipment Maintenance Table

  1. Changes
    - Drop equipment_maintenance table
    - Remove maintenance-related references from equipment queries
    
  2. Security
    - No RLS changes needed as table is being removed
*/

-- Drop the equipment_maintenance table if it exists
DROP TABLE IF EXISTS equipment_maintenance CASCADE;