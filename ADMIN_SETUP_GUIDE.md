# 🚀 Admin Monitoring System - Quick Setup Guide

## What's New?

Your admin panel now has **complete user monitoring with password tracking** through Supabase. Every user sign-up and login is recorded with their full information.

## Setup Steps

### Step 1: Run Database Migration

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the SQL from: `supabase/migrations/002_admin_monitoring_schema.sql`
4. Click **Run**

This creates all required tables:
- `users` - User profiles with passwords
- `user_expertise` - User expertise areas
- `user_hobbies` - User hobbies
- `activity_logs` - Sign-in/sign-up tracking
- And more...

### Step 2: Update Environment Variables

Add to your `.env.local`:

```env
# If you don't have these already, add them:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=your_secure_admin_password
```

**Where to find these:**
- Go to Supabase Project Settings → API
- Copy URL and anon key
- Copy service_role key (keep this secret!)

### Step 3: Get Your Keys from Supabase

1. **NEXT_PUBLIC_SUPABASE_URL**: Supabase Settings → API → URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase Settings → API → anon key
3. **SUPABASE_SERVICE_ROLE_KEY**: Supabase Settings → API → service_role key

## Access Admin Panel

### Login to Admin Panel
1. Go to `/admin/login` in your app
2. Click **Admin Login** button on sign-in page
3. Enter admin password (default: `admin123` - change this!)
4. You'll see the admin dashboard

### View Users & Passwords

In the **Admin Dashboard**:

1. **Users Tab** shows:
   - Username
   - Name
   - Email
   - **Password** (in plain text)
   - User role (Mentor/Mentee)
   - Click "View Details" for full profile

2. **User Details Sidebar** shows:
   - Full name and avatar
   - Email
   - **Password** (highlighted in red)
   - Age, grade, course
   - Expertise and hobbies
   - Account creation date

3. **Activity Tab** shows:
   - All sign-ins and sign-outs
   - Timestamps
   - IP addresses
   - User agents (browser info)

## Features Overview

### What Admin Can Monitor

✅ **User Credentials**
- Username
- Password (plain text)
- Email address

✅ **User Profile**
- Full name
- Age
- Grade level
- Course
- Hobbies
- Expertise areas
- Profile picture

✅ **User Activity**
- Sign-up date
- Last login time
- Login IP addresses
- Browser/device information
- All login history

✅ **User Roles**
- Mentor or Mentee status
- Can change user roles (future feature)

### Search & Filter

- Search by username
- Search by full name
- Search by email
- Real-time filtering

### User Details

Click any user's "View Details" button to see:
- Complete profile information
- Current password in red box
- All expertise and hobbies
- Account timeline

## Daily Usage

### For Monitoring New Signups
1. Go to Admin Dashboard → Users Tab
2. New users appear at the top of the list
3. Click "View Details" to see their information
4. Password is shown in red box

### For Checking User Activity
1. Go to Admin Dashboard → Activity Tab
2. See all logins and sign-ups
3. View IP addresses and timestamps
4. Identify suspicious activity

### For Finding Specific Users
1. Use search bar in Users Tab
2. Type username, name, or email
3. Results filter in real-time
4. Click user to view full details

## Important Notes

### ⚠️ Security Reminders

1. **Change Admin Password**
   - Default is `admin123`
   - Update `ADMIN_PASSWORD` in `.env.local`
   - Use a strong password (20+ characters recommended)

2. **Protect Your Keys**
   - Never commit `.env.local` to git
   - Keep `SUPABASE_SERVICE_ROLE_KEY` secret
   - Don't share admin credentials

3. **Password Storage**
   - Passwords are stored in plain text in database
   - This allows admin viewing but is a security risk
   - Consider encrypting passwords in production

4. **Activity Logs**
   - All sign-ins are logged with IP/browser info
   - Keep logs for compliance/audit trails
   - Review activity logs regularly

## Customization

### Change Admin Password

Update in `.env.local`:
```env
ADMIN_PASSWORD=your_new_strong_password_here
```

Then restart your app.

### Customize User Roles

To add more roles besides "mentor" and "mentee", edit `src/app/signup/page.tsx`:
```typescript
const STATUS_OPTIONS = ['mentee', 'mentor', 'tutor', 'admin']
```

### Add More User Fields

To add new fields (e.g., "phone_number"):

1. Add column to Supabase `users` table
2. Update `types/index.ts` UserProfile interface
3. Update signup/signin APIs
4. Update admin dashboard table

## Troubleshooting

### Admin Panel Shows "Unauthorized"
- Check if admin token is in localStorage
- Try clearing browser cache
- Re-login to admin panel

### Passwords Not Showing
- Make sure `plain_password` column exists in database
- Run the SQL migration again
- Check that users are signing up after migration

### No Activity Logs
- Verify `activity_logs` table exists
- Check Supabase database for errors
- Confirm service role key is correct

### Slow Performance
- Database has too much activity data
- Archive old activity logs (older than 6 months)
- Add more indexes to database

## Next Steps

### Optional Enhancements

1. **Email Notifications**
   - Alert on new user signup
   - Alert on suspicious activity
   - Daily activity digest

2. **User Management**
   - Delete user accounts
   - Reset user passwords
   - Ban/unban users

3. **Advanced Analytics**
   - User growth charts
   - Login activity heatmap
   - Conversion metrics

4. **Data Export**
   - Export user list to CSV
   - Export activity logs
   - Generate reports

5. **Security**
   - Two-factor authentication for admin
   - IP whitelist for admin access
   - Audit log for admin actions

## File Changes Made

```
✅ /api/admin/data/route.ts        - Now includes plainPassword
✅ /api/auth/signup/route.ts       - Stores plain password
✅ /api/auth/signin/route.ts       - Updates plain password on login
✅ /admin/dashboard/page.tsx       - Shows passwords & user details
✅ ADMIN_MONITORING_SYSTEM.md      - Complete documentation
✅ migrations/002_admin_...        - Database setup SQL
```

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **NextJS Docs**: https://nextjs.org/docs
- **Bcrypt**: https://www.npmjs.com/package/bcryptjs

## Security Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Use strong admin password (20+ characters)
3. ✅ Enable Supabase RLS (Row Level Security)
4. ✅ Regularly review activity logs
5. ✅ Archive old logs periodically
6. ✅ Use environment variables for secrets
7. ✅ Never commit secrets to git
8. ✅ Implement IP whitelist for admin access (future)

## You're All Set! 🎉

Your admin monitoring system is ready to use. Start by:

1. Running the SQL migration
2. Setting up environment variables
3. Creating a test user account
4. Logging into admin panel
5. Verifying user information appears correctly

The system will now track all sign-ups and logins automatically!
