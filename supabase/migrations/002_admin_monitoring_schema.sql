-- Peer Mentor Game - Database Setup Script
-- Run this in Supabase SQL Editor to set up all required tables

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  plain_password TEXT,              -- Stored for admin viewing (security consideration)
  grade TEXT DEFAULT 'College 1st Year',
  age INTEGER DEFAULT 18,
  course TEXT,
  status TEXT DEFAULT 'mentee',     -- 'mentor' or 'mentee'
  profile_picture TEXT,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create User Expertise Table
CREATE TABLE IF NOT EXISTS user_expertise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expertise TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create User Hobbies Table
CREATE TABLE IF NOT EXISTS user_hobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hobby TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  action TEXT NOT NULL,            -- 'signin', 'signout', 'signup', 'admin_login', 'admin_login_failed'
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- 5. Create Messages Table (for messaging system)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_avatar TEXT,
  recipient_id TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_avatar TEXT,
  text TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Create User Practice Progress Table (for learning system)
CREATE TABLE IF NOT EXISTS user_practice_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practice_topic TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  accuracy DECIMAL(5, 2) DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Create User Badges Table (for achievement system)
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  badge_icon TEXT,
  points_earned INTEGER DEFAULT 0,
  earned_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes for Better Performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login DESC);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_expertise_user_id ON user_expertise(user_id);
CREATE INDEX IF NOT EXISTS idx_user_expertise_expertise ON user_expertise(expertise);

CREATE INDEX IF NOT EXISTS idx_user_hobbies_user_id ON user_hobbies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_hobbies_hobby ON user_hobbies(hobby);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_username ON activity_logs(username);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);

CREATE INDEX IF NOT EXISTS idx_practice_progress_user_id ON user_practice_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_progress_completed ON user_practice_progress(completed);

CREATE INDEX IF NOT EXISTS idx_badges_user_id ON user_badges(user_id);

-- Enable RLS (Row Level Security) - Optional
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create Policies for users table (optional - for production)
-- CREATE POLICY "Users can read their own data" ON users
--   FOR SELECT USING (auth.uid()::text = id::text);

-- Create Policies for activity_logs (optional - for admin access)
-- CREATE POLICY "Admins can view activity logs" ON activity_logs
--   FOR SELECT USING (current_setting('app.admin_role') = 'admin');

-- View for User Statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
  COUNT(DISTINCT id) as total_users,
  COUNT(DISTINCT CASE WHEN status = 'mentor' THEN id END) as total_mentors,
  COUNT(DISTINCT CASE WHEN status = 'mentee' THEN id END) as total_mentees,
  COUNT(DISTINCT CASE WHEN last_login IS NOT NULL THEN id END) as active_users,
  MAX(created_at) as latest_signup
FROM users;

-- View for Activity Statistics
CREATE OR REPLACE VIEW activity_statistics AS
SELECT 
  DATE(timestamp) as activity_date,
  action,
  COUNT(*) as count
FROM activity_logs
GROUP BY DATE(timestamp), action
ORDER BY activity_date DESC;

-- View for Mentor-Mentee Statistics
CREATE OR REPLACE VIEW mentorship_statistics AS
SELECT 
  status,
  COUNT(*) as count,
  AVG(age) as avg_age,
  ARRAY_AGG(DISTINCT course) as courses
FROM users
WHERE status IS NOT NULL
GROUP BY status;

-- Grant permissions to service role (update with your role)
-- GRANT ALL ON users TO anon;
-- GRANT ALL ON activity_logs TO anon;
-- GRANT ALL ON user_expertise TO anon;
-- GRANT ALL ON user_hobbies TO anon;

PRINT 'Database setup completed successfully!';
