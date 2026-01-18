-- Cleanup Script: Remove Unnecessary Tables
-- Run this in Supabase SQL Editor to clean up your database

-- Drop unnecessary tables (in correct order to avoid foreign key errors)

-- 1. Drop admin_notifications table (not needed)
DROP TABLE IF EXISTS admin_notifications CASCADE;

-- 2. Drop admins table (not needed - use users with status instead)
DROP TABLE IF EXISTS admins CASCADE;

-- 3. Drop profiles table if it's not being used (we use users instead)
-- DROP TABLE IF EXISTS profiles CASCADE;

-- Verify remaining tables
-- The following tables should remain:
-- - users (main user table with passwords)
-- - user_expertise (user skills)
-- - user_hobbies (user interests)
-- - activity_logs (login/signup tracking)
-- - messages (for messaging system)
-- - user_practice_progress (for learning system)
-- - user_badges (for achievement system)

-- List all remaining tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
