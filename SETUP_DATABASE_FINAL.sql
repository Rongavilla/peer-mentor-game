-- PEER MENTOR GAME - DATABASE SETUP
-- Copy and paste this entire script into Supabase SQL Editor and click RUN

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

CREATE TABLE IF NOT EXISTS user_expertise (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expertise VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_hobbies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hobby VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_name VARCHAR(255) NOT NULL,
  badge_icon VARCHAR(500),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_expertise ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_practice_progress ENABLE ROW LEVEL SECURITY;

-- USERS RLS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users read all profiles') THEN
    CREATE POLICY "Users read all profiles" ON users FOR SELECT TO authenticated, anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile') THEN
    CREATE POLICY "Users can insert their own profile" ON users FOR INSERT TO authenticated, anon WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users update own profile') THEN
    CREATE POLICY "Users update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid()::text = id::text);
  END IF;
END $$;

-- ACTIVITY LOGS RLS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Activity logs read') THEN
    CREATE POLICY "Activity logs read" ON activity_logs FOR SELECT TO authenticated, anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Activity logs insert') THEN
    CREATE POLICY "Activity logs insert" ON activity_logs FOR INSERT TO authenticated, anon WITH CHECK (true);
  END IF;
END $$;

-- MESSAGES RLS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Messages read own') THEN
    CREATE POLICY "Messages read own" ON messages FOR SELECT TO authenticated USING (auth.uid()::text = sender_id::text OR auth.uid()::text = recipient_id::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Messages insert own') THEN
    CREATE POLICY "Messages insert own" ON messages FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = sender_id::text);
  END IF;
END $$;

-- EXPERTISE RLS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Expertise read') THEN
    CREATE POLICY "Expertise read" ON user_expertise FOR SELECT TO authenticated, anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Expertise own') THEN
    CREATE POLICY "Expertise own" ON user_expertise FOR ALL TO authenticated USING (auth.uid()::text = user_id::text);
  END IF;
END $$;

-- HOBBIES RLS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Hobbies read') THEN
    CREATE POLICY "Hobbies read" ON user_hobbies FOR SELECT TO authenticated, anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Hobbies own') THEN
    CREATE POLICY "Hobbies own" ON user_hobbies FOR ALL TO authenticated USING (auth.uid()::text = user_id::text);
  END IF;
END $$;

-- BADGES RLS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Badges read') THEN
    CREATE POLICY "Badges read" ON user_badges FOR SELECT TO authenticated, anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Badges own') THEN
    CREATE POLICY "Badges own" ON user_badges FOR ALL TO authenticated USING (auth.uid()::text = user_id::text);
  END IF;
END $$;

-- PROGRESS RLS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Progress read') THEN
    CREATE POLICY "Progress read" ON user_practice_progress FOR SELECT TO authenticated, anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Progress own') THEN
    CREATE POLICY "Progress own" ON user_practice_progress FOR ALL TO authenticated USING (auth.uid()::text = user_id::text);
  END IF;
END $$;
