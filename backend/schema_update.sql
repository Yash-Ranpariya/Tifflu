-- Update Schema for Chef's Special Feature
-- Run this script in your MySQL database (tifflu_db_v2)

ALTER TABLE Menu_Items ADD COLUMN is_chef_special BOOLEAN DEFAULT FALSE;

-- Optional: Set some items as chef special for testing
-- UPDATE Menu_Items SET is_chef_special = TRUE WHERE item_id IN (1, 3);
