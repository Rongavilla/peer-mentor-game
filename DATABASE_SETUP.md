# 🗄️ Database Setup Guide

## Overview
Your app is now connected to **Supabase** with a complete database schema for users, activities, expertise, and hobbies.

## What's Connected

### Database Tables
1. **users** - User profiles with authentication
2. **user_expertise** - User skills/expertise areas
3. **user_hobbies** - User hobbies/interests
4. **activity_logs** - Sign-in/sign-out tracking

### API Endpoints Updated
- `POST /api/auth/signin` - Now queries the database
- `POST /api/auth/signup` - Now stores users in database
- `POST /api/auth/logout` - Logs logout activity
- `PUT /api/profile/update` - Updates user profiles
- `GET/POST /api/matching` - Finds matches from database

## Setup Instructions

### Step 1: Run the Database Migration

Go to your Supabase project and run the SQL from:
```
supabase/migrations/001_initial_schema.sql
```

**How to apply the migration:**

1. Go to [Supabase Dashboard](https://supabase.com) → Your Project
2. Click **SQL Editor**
3. Click **+ New Query**
4. Copy the entire content from `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run**

### Step 2: Verify Credentials

Check your `.env.local` file has:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://gpfyuvgxsddaeqdetqbl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Test the Connection

1. Start your dev server: `npm run dev`
2. Go to `/signup`
3. Create a new account
4. Check Supabase dashboard → SQL Editor → Run:
   ```sql
   SELECT * FROM users;
   ```
5. Your new user should appear!

## Key Features

### ✅ Password Security
- Passwords are hashed with bcrypt
- Never stored in plain text
- Safe comparison during login

### ✅ Activity Tracking
- Automatic signin/signout logging
- IP address and user agent captured
- Timestamp for each action

### ✅ Data Relationships
- Users linked to expertise and hobbies
- Cascading deletes (when user deleted, related data removed)
- Efficient queries with indexes

### ✅ Row Level Security (RLS)
- Users can read public profiles
- Users can only update their own profile
- Activity logs are append-only

## Database Schema

### users table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  profile_picture VARCHAR(500),
  grade VARCHAR(50),
  course VARCHAR(255),
  age INTEGER,
  status VARCHAR(20), -- 'mentee' or 'mentor'
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_login TIMESTAMP
);
```

### user_expertise table
```sql
CREATE TABLE user_expertise (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  expertise VARCHAR(255),
  created_at TIMESTAMP
);
```

### user_hobbies table
```sql
CREATE TABLE user_hobbies (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  hobby VARCHAR(255),
  created_at TIMESTAMP
);
```

### activity_logs table
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  username VARCHAR(255),
  action VARCHAR(50), -- 'signin' or 'signout'
  ip_address VARCHAR(45),
  user_agent TEXT,
  timestamp TIMESTAMP,
  created_at TIMESTAMP
);
```

## API Examples

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure123",
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure123"
  }'
```

### Update Profile
```bash
curl -X PUT http://localhost:3000/api/profile/update \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id-here",
    "name": "John Updated",
    "grade": "College 2nd Year",
    "course": "Computer Science",
    "age": 20,
    "expertise": ["JavaScript", "React", "Node.js"],
    "hobbies": ["Gaming", "Reading"]
  }'
```

### Find Matches
```bash
curl -X POST http://localhost:3000/api/matching \
  -H "Content-Type: application/json" \
  -d '{
    "userProfile": { "id": "...", "expertise": [...], "hobbies": [...] },
    "role": "mentor"
  }'
```

## Admin Dashboard

View all user activity in the admin panel:
- Go to `/admin/login`
- Login with default: `admin` / `admin123`
- Check the "Activity" tab to see all signin/signout events
- Check the "Users" tab to see all stored users from database

## Troubleshooting

### "Cannot find module 'bcryptjs'"
- Run: `npm install bcryptjs --save`

### "Supabase connection error"
- Check `.env.local` has correct credentials
- Verify Supabase project is active
- Check network connectivity

### "Table not found" error
- Make sure you ran the SQL migration
- Refresh Supabase dashboard
- Check table names are correct

### Users not appearing in database
- Check signup response for errors
- Look at browser console for error messages
- Verify Supabase credentials are correct

## Next Steps

1. ✅ Run database migration
2. ✅ Test signup/signin flow
3. ✅ View users in Supabase dashboard
4. ✅ Check activity logs in admin panel
5. ✅ Monitor matching algorithm performance

## Monitoring

### Check Database Growth
```sql
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_activities FROM activity_logs;
```

### See Recent Activity
```sql
SELECT username, action, timestamp 
FROM activity_logs 
ORDER BY timestamp DESC 
LIMIT 20;
```

### Find All Mentors
```sql
SELECT * FROM users WHERE status = 'mentor';
```

---

**Status**: ✅ Database Connected!
**Next**: Run migrations and test the flow
