# 🆘 Fix: Database Connection Issue

## Problem
You're seeing **"Failed to sign up"** - the database tables don't exist yet.

## Solution (5 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project `peer-mentor-game`
3. Click **SQL Editor** (left sidebar)
4. Click **+ New Query**

### Step 2: Copy and Paste SQL
1. Open this file: `SIMPLE_SETUP.sql` (in your project root)
2. Copy **ALL** the SQL code
3. Paste into Supabase SQL Editor
4. Click **Run** button

### Step 3: Wait for Success
- You should see: ✅ "Success"
- The SQL will create all 4 tables
- Don't worry about error messages about "already exists" - that's normal

### Step 4: Verify Tables Created
Run this quick check in SQL Editor:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

You should see:
```
activity_logs
user_expertise
user_hobbies
users
```

### Step 5: Try Signing Up Again
1. Go to http://localhost:3000/signup
2. Fill in the form:
   - Full name: Your name
   - Username: username123
   - Password: password123
3. Click "Create account"
4. **Should work now!** ✅

## If Still Not Working

### Check Error Details
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try signing up again
4. Look for error messages
5. Copy the error and share it

### Common Errors

**Error: "Relation 'users' does not exist"**
→ SQL migration wasn't run. Go back to Step 1-3.

**Error: "Username already exists"**
→ Try a different username.

**Error: "Password must be at least 6 characters"**
→ Use a longer password.

**Error: "Supabase connection error"**
→ Check .env.local has correct credentials.

## Verify Connection Works

### Quick Test
1. Go to http://localhost:3000/test-db
2. Click "Test Connection"
3. Should show green ✅ and table counts

If this shows success, your database is working!

## What's Happening

```
Your Form Input
    ↓
API /auth/signup
    ↓
Check bcryptjs installed ✅
    ↓
Try to insert user into database ❌ (tables don't exist)
    ↓
Return: "Failed to sign up"
```

Once you run the SQL:

```
Your Form Input
    ↓
API /auth/signup
    ↓
Check bcryptjs installed ✅
    ↓
Hash password with bcrypt ✅
    ↓
Insert user into database ✅ (tables exist now!)
    ↓
Insert activity log ✅
    ↓
Return: User created! Redirect to dashboard
```

## Need Help?

### Check These Files
- `.env.local` - Has Supabase URL and key?
- `src/app/api/auth/signup/route.ts` - Looks correct?
- `SIMPLE_SETUP.sql` - SQL to run

### Ask Questions
- What error do you see in the browser console?
- Did the SQL run without errors?
- Can you see the tables in Supabase?

---

## Quick Checklist

- [ ] Go to Supabase dashboard
- [ ] Create new SQL query
- [ ] Copy SIMPLE_SETUP.sql content
- [ ] Paste and run
- [ ] See tables created (activity_logs, user_expertise, user_hobbies, users)
- [ ] Try signing up again
- [ ] See green success message
- [ ] Check admin panel for new user

**Expected Time**: 5 minutes
**Difficulty**: Easy
**Status**: Fixable right now ✅
