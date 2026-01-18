-- Add plain_password column to users table if it doesn't exist
-- This column stores the plain text password for admin viewing

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS plain_password TEXT;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
