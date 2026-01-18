-- ============================================
-- PEER MENTOR GAME - DATABASE SETUP SCRIPT
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  profile_picture VARCHAR(500),
  grade VARCHAR(50),
  course VARCHAR(255),
  age INTEGER,
  status VARCHAR(20) DEFAULT 'mentee' CHECK (status IN ('mentee', 'mentor')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- ============================================
-- 2. USER EXPERTISE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_expertise (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expertise VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. USER HOBBIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_hobbies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hobby VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  username VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL CHECK (action IN ('signin', 'signout')),
  ip_address VARCHAR(45),
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. MESSAGES TABLE (for mentor-mentee chat)
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. USER BADGES TABLE (achievements)
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_name VARCHAR(255) NOT NULL,
  badge_icon VARCHAR(500),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. USER PRACTICE PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_practice_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_name VARCHAR(255) NOT NULL,
  score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  last_played TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_user_expertise_user_id ON user_expertise(user_id);
CREATE INDEX IF NOT EXISTS idx_user_hobbies_user_id ON user_hobbies(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_username ON activity_logs(username);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_practice_user_id ON user_practice_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_practice_game ON user_practice_progress(game_name);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_expertise ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_practice_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - USERS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can read all public profiles" ON users;
CREATE POLICY "Users can read all public profiles"
  ON users FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- ============================================
-- RLS POLICIES - ACTIVITY LOGS
-- ============================================
DROP POLICY IF EXISTS "Activity logs are readable" ON activity_logs;
CREATE POLICY "Activity logs are readable"
  ON activity_logs FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Activity logs can only be inserted" ON activity_logs;
CREATE POLICY "Activity logs can only be inserted"
  ON activity_logs FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- ============================================
-- RLS POLICIES - MESSAGES
-- ============================================
DROP POLICY IF EXISTS "Users can read their own messages" ON messages;
CREATE POLICY "Users can read their own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = sender_id::text OR 
    auth.uid()::text = recipient_id::text
  );

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = sender_id::text);

-- ============================================
-- RLS POLICIES - USER EXPERTISE
-- ============================================
DROP POLICY IF EXISTS "Users expertise is publicly readable" ON user_expertise;
CREATE POLICY "Users expertise is publicly readable"
  ON user_expertise FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Users can manage their own expertise" ON user_expertise;
CREATE POLICY "Users can manage their own expertise"
  ON user_expertise FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- ============================================
-- RLS POLICIES - USER HOBBIES
-- ============================================
DROP POLICY IF EXISTS "Users hobbies are publicly readable" ON user_hobbies;
CREATE POLICY "Users hobbies are publicly readable"
  ON user_hobbies FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Users can manage their own hobbies" ON user_hobbies;
CREATE POLICY "Users can manage their own hobbies"
  ON user_hobbies FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- ============================================
-- RLS POLICIES - USER BADGES
-- ============================================
DROP POLICY IF EXISTS "User badges are publicly readable" ON user_badges;
CREATE POLICY "User badges are publicly readable"
  ON user_badges FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Users can manage their own badges" ON user_badges;
CREATE POLICY "Users can manage their own badges"
  ON user_badges FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- ============================================
-- RLS POLICIES - USER PRACTICE PROGRESS
-- ============================================
DROP POLICY IF EXISTS "User practice is publicly readable" ON user_practice_progress;
CREATE POLICY "User practice is publicly readable"
  ON user_practice_progress FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Users can manage their own progress" ON user_practice_progress;
CREATE POLICY "Users can manage their own progress"
  ON user_practice_progress FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- If you see this comment, the script completed!
-- All tables have been created with RLS policies enabled.
-- You can now use the database explorer!
