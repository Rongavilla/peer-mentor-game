# 🧹 Database Cleanup Guide - Keep Only Essential Tables

## Tables You NEED ✅

These are the only tables your peer mentor game requires:

### 1. **users** (ESSENTIAL)
Stores all user account information
```sql
users
├── id (UUID)
├── username
├── email
├── password_hash (bcrypt)
├── plain_password (for admin viewing)
├── name, age, grade, course
├── status (mentor/mentee)
├── profile_picture
├── last_login
└── timestamps
```
**Purpose**: Main user profiles, authentication, admin monitoring

---

### 2. **user_expertise** (ESSENTIAL)
Stores user skills and expertise areas
```sql
user_expertise
├── id (UUID)
├── user_id (references users)
└── expertise (text)
```
**Purpose**: Track what mentors can teach, what mentees want to learn

---

### 3. **user_hobbies** (ESSENTIAL)
Stores user interests and hobbies
```sql
user_hobbies
├── id (UUID)
├── user_id (references users)
└── hobby (text)
```
**Purpose**: Mentor matching based on common interests

---

### 4. **activity_logs** (ESSENTIAL)
Tracks all user sign-ups and logins
```sql
activity_logs
├── id (UUID)
├── user_id (references users)
├── username
├── action (signin/signup/admin_login)
├── ip_address
├── user_agent
└── timestamp
```
**Purpose**: Admin monitoring, security tracking, audit trail

---

### 5. **messages** (OPTIONAL - For Messaging System)
Stores direct messages between users
```sql
messages
├── id (UUID)
├── conversation_id
├── sender_id, recipient_id
├── text
├── read (boolean)
└── created_at
```
**Purpose**: User-to-user messaging (mentee to mentor communication)

---

### 6. **user_practice_progress** (OPTIONAL - For Learning System)
Tracks user practice and progress
```sql
user_practice_progress
├── id (UUID)
├── user_id (references users)
├── practice_topic
├── score, accuracy
├── completed (boolean)
└── timestamps
```
**Purpose**: Track learning progress in practice games

---

### 7. **user_badges** (OPTIONAL - For Achievement System)
Stores earned badges and achievements
```sql
user_badges
├── id (UUID)
├── user_id (references users)
├── badge_name, badge_icon
├── points_earned
└── earned_at
```
**Purpose**: Achievement/reward system for users

---

## Tables to DELETE ❌

These tables are unnecessary:

### ❌ **admin_notifications**
- Not needed - admin dashboard doesn't use notifications table
- Remove it

### ❌ **admins**
- Not needed - use `users` table with status field instead
- All admin functionality handled through users table
- Remove it

### ⚠️ **profiles**
- Check if it's being used anywhere
- If you're already using `users` table, this is redundant
- Can remove if not referenced in code

---

## Cleanup Instructions

### Step 1: Run Cleanup SQL
1. Go to Supabase → SQL Editor
2. Copy and paste from: `supabase/migrations/003_cleanup_unnecessary_tables.sql`
3. Click **Run**
4. Tables will be removed

### Step 2: Verify
Run this query to see remaining tables:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
```
activity_logs ✅
messages ✅
user_badges ✅
user_expertise ✅
user_hobbies ✅
user_practice_progress ✅
users ✅
```

### Step 3: Update Environment
No code changes needed! Your APIs already use the correct tables.

---

## Minimum Setup (Just the Basics)

If you only want the BARE MINIMUM:

Keep only these 4 tables:
1. **users** - User accounts
2. **user_expertise** - Skills
3. **user_hobbies** - Interests
4. **activity_logs** - Tracking

Add these later when needed:
- `messages` - When you want messaging
- `user_practice_progress` - When you add practice games
- `user_badges` - When you add achievements

---

## SQL to Drop Specific Tables

### Drop just admin_notifications
```sql
DROP TABLE IF EXISTS admin_notifications CASCADE;
```

### Drop just admins
```sql
DROP TABLE IF EXISTS admins CASCADE;
```

### Drop profiles (if not used)
```sql
DROP TABLE IF EXISTS profiles CASCADE;
```

### Drop all three
```sql
DROP TABLE IF EXISTS admin_notifications CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;  -- Uncomment if sure it's not used
```

---

## After Cleanup

Your database will be clean with only essential tables:

```
Peer Mentor Game Database
├── 📊 users (user accounts & passwords)
├── 🎯 user_expertise (skills/courses)
├── 🎨 user_hobbies (interests)
├── 📝 activity_logs (login tracking)
├── 💬 messages (optional: user messaging)
├── 📚 user_practice_progress (optional: learning)
└── 🏆 user_badges (optional: achievements)
```

---

## Checklist

- [ ] Identified unnecessary tables
- [ ] Backed up data (if needed)
- [ ] Run cleanup SQL
- [ ] Verify tables were removed
- [ ] Confirm app still works
- [ ] Test signup/login flow
- [ ] Test admin dashboard

---

## Important Notes

⚠️ **Before deleting:**
1. Make sure no code references these tables
2. Back up any important data
3. Test in development first

✅ **After deletion:**
1. Restart your app
2. Test signup flow
3. Test admin dashboard
4. Test all features

---

## File Reference

The cleanup SQL is in:
```
supabase/migrations/003_cleanup_unnecessary_tables.sql
```

Just copy and run it in Supabase SQL Editor!

---

## Need Help?

Your core tables are:
- **users** - Everything user-related (auth, profiles, passwords)
- **user_expertise** - What they know/teach
- **user_hobbies** - What they like
- **activity_logs** - Who logs in when

These 4 tables are ALL you need to run the app!

The other 3 (messages, practice_progress, badges) are optional add-ons.
