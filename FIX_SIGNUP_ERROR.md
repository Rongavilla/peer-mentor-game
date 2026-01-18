# 🔧 Fix Signup Error

## The Problem
The signup is failing because your Supabase `users` table is missing the `plain_password` column.

## The Solution

### Step 1: Add Missing Column to Supabase

Go to **Supabase SQL Editor** and run this:

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS plain_password TEXT;
```

That's it! This adds the missing column that your app needs.

### Step 2: Refresh Your App

Go back to your signup page and try again:
- http://localhost:3000/signup

### What Changed
- ✅ Fixed error handling in signup API (better error messages)
- ✅ Created migration file: `supabase/migrations/004_add_plain_password_column.sql`

---

## How to Run Migrations in Supabase

1. Open your **Supabase project**
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy & paste the SQL above
5. Click **Run** button
6. Done! ✅

---

## Why This Column?

The `plain_password` column is used by your admin panel to display user passwords. It's stored alongside the `password_hash` for admin viewing convenience.

---

## Verify It Works

After adding the column:
1. Try signing up with a test user
2. Go to **Admin Login** (yellow button on signup page)
3. Use admin credentials to view all users with passwords visible

---

If you still get an error, check:
- ✅ Column added: `plain_password` in users table
- ✅ App is running: `npm run dev`
- ✅ Browser refreshed (hard refresh with Ctrl+Shift+R)

