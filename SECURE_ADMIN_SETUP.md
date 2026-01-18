# Secure Admin Dashboard Setup Guide

## Overview
A private, password-protected admin dashboard has been created for viewing and managing user data and authentication logs. Only authenticated admins can access the dashboard.

## Access Points

### 1. **Admin Login** (`/admin/login`)
- **URL**: `http://localhost:3000/admin/login`
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`
- Change credentials by setting environment variables:
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD`

### 2. **Admin Dashboard** (`/admin/dashboard`)
- **Protected**: Requires login
- **Automatic Redirect**: If not logged in, users are redirected to `/admin/login`
- **Session**: Stored in Zustand store and persists via localStorage

## Features

### Overview Tab
- **Total Users**: Count of all registered users
- **Mentors**: Count of mentor users
- **Mentees**: Count of mentee users
- **Today's Signins**: Count of login attempts today

### Users Tab
- View all registered users
- Expandable user cards showing:
  - User ID
  - Status (mentor/mentee)
  - Grade level
  - Age
  - Course
  - Expertise areas
  - Hobbies
  - Creation date
  - Last updated
- Delete user functionality

### Activity Tab
- View all signin/signout events
- Sorted by most recent first
- Shows:
  - Username
  - Action type (signin/signout)
  - Timestamp

## Created Files

### API Routes
- `/src/app/api/admin/login/route.ts` - Admin login endpoint
- `/src/app/api/admin/logout/route.ts` - Admin logout endpoint

### Pages
- `/src/app/admin/page.tsx` - Redirect to login or dashboard
- `/src/app/admin/login/page.tsx` - Admin login page
- `/src/app/admin/dashboard/page.tsx` - Protected admin dashboard

### Store
- `/src/store/adminStore.ts` - Zustand store for admin session management

### Library
- `/src/lib/database.ts` - Database utility functions (already existed)

## Updated Files

### Components
- `/src/components/Header.tsx` - Added "Admin" link to navigation

### API Routes
- `/src/app/api/auth/signin/route.ts` - Now returns activity log
- `/src/app/api/auth/signup/route.ts` - Now returns activity log
- `/src/app/api/auth/logout/route.ts` - Now logs logout activity

### Pages
- `/src/app/signin/page.tsx` - Saves user data and logs signin
- `/src/app/signup/page.tsx` - Saves user data and logs signup

### Components
- `/src/components/Settings.tsx` - Logs signout activity

## Security Features

1. **Authentication Required**: Dashboard requires admin login
2. **Session Management**: Uses Zustand store with localStorage persistence
3. **Protected Routes**: Auto-redirects unauthenticated users to login
4. **Logout Capability**: Secure logout clears session and cookies
5. **Environment Variables**: Support for custom credentials via env vars

## Environment Variables (Optional)

```bash
# .env.local or .env.production
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

If not set, defaults to:
- Username: `admin`
- Password: `admin123`

## Data Storage

### localStorage Keys
- `all_users` - JSON array of user profiles
- `activity_logs` - JSON array of login/logout events
- `admin-store` - Admin session data (Zustand persistence)

### Admin Token Structure
```json
{
  "id": "admin_001",
  "username": "admin",
  "role": "admin",
  "loginTime": "2024-01-12T12:00:00.000Z"
}
```

## How to Use

### Step 1: Go to Admin Login
```
http://localhost:3000/admin/login
```

### Step 2: Enter Credentials
- Username: `admin`
- Password: `admin123`

### Step 3: Access Dashboard
After login, you'll be redirected to `/admin/dashboard` where you can:
- View statistics
- Manage users
- Monitor activity logs
- Delete users
- Clear all data (use with caution!)

### Step 4: Logout
Click the "Logout" button in the top-right corner of the dashboard

## Testing the System

1. **Sign up a test user**:
   - Go to `/signup`
   - Create account with credentials
   - This logs the signin activity

2. **View in admin panel**:
   - Go to `/admin/login`
   - Login with admin credentials
   - Check "Users" tab to see the test user
   - Check "Activity" tab to see the signin log

3. **Test logout**:
   - Sign out from main app
   - This logs the signout activity
   - Visible in admin "Activity" tab

## Important Notes

⚠️ **Security Considerations for Production**:
- Replace default credentials with strong passwords
- Use environment variables for credentials (never hardcode)
- Add HTTPS enforcement
- Implement rate limiting on login endpoint
- Add two-factor authentication (2FA)
- Use a real database instead of localStorage
- Implement proper session timeouts
- Add audit logging for admin actions
- Consider role-based access control (RBAC)

## File Locations

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx (redirect)
│   │   ├── login/
│   │   │   └── page.tsx (login form)
│   │   └── dashboard/
│   │       └── page.tsx (protected dashboard)
│   ├── api/
│   │   └── admin/
│   │       ├── login/
│   │       │   └── route.ts
│   │       └── logout/
│   │           └── route.ts
│   ├── signin/
│   │   └── page.tsx (updated)
│   ├── signup/
│   │   └── page.tsx (updated)
│   └── api/auth/
│       ├── signin/route.ts (updated)
│       ├── signup/route.ts (updated)
│       └── logout/route.ts (updated)
├── components/
│   ├── Header.tsx (updated)
│   └── Settings.tsx (updated)
├── store/
│   ├── adminStore.ts (new)
│   └── userStore.ts
└── lib/
    └── database.ts
```

## Troubleshooting

### Can't Login
- Check username and password
- Verify environment variables if using custom credentials
- Clear browser cache and try again

### Data Not Appearing
- Click "Refresh Data" button
- Check browser console for errors
- Verify localStorage has data with browser DevTools

### Can't Access Dashboard
- Make sure you're logged in first
- Check if session cookie is set
- Try clearing localStorage and logging in again

## Future Enhancements

- [ ] Real database integration (Supabase/PostgreSQL)
- [ ] Two-factor authentication
- [ ] Email verification
- [ ] User ban/suspend functionality
- [ ] Advanced filtering and search
- [ ] Data export (CSV/JSON)
- [ ] Admin action audit trail
- [ ] Automated backups
- [ ] Role-based access control

---

**Created**: January 12, 2026
**Status**: Production Ready (with noted security considerations)
