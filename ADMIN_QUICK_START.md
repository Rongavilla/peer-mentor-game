# 🔐 Admin Dashboard Quick Start

## Login Now

**URL**: `http://localhost:3000/admin/login`

### Default Credentials
```
Username: admin
Password: admin123
```

## Features ✨

### 📊 Overview Tab
- Total users count
- Mentors count
- Mentees count
- Today's sign-ins

### 👥 Users Tab
- View all registered users
- Expand to see full profile details
- Delete users
- See expertise and hobbies

### 📋 Activity Tab
- Track all sign-in/sign-out events
- Sorted by most recent
- Real-time user engagement data

## Quick Actions

| Action | Location |
|--------|----------|
| **Login** | `/admin/login` |
| **Dashboard** | `/admin/dashboard` (auto after login) |
| **Logout** | Click "Logout" button (top-right) |
| **Refresh** | Click "Refresh Data" button |
| **Clear Data** | Click "Clear All Data" button (⚠️ careful!) |

## Files Created

```
✅ /src/app/admin/login/page.tsx          - Admin login page
✅ /src/app/admin/dashboard/page.tsx      - Protected dashboard
✅ /src/app/api/admin/login/route.ts      - Login API
✅ /src/app/api/admin/logout/route.ts     - Logout API
✅ /src/store/adminStore.ts               - Session management
```

## Files Updated

```
🔄 /src/components/Header.tsx             - Added Admin link
🔄 /src/app/signin/page.tsx               - Logs user activity
🔄 /src/app/signup/page.tsx               - Logs user activity
🔄 /src/app/api/auth/signin/route.ts      - Activity logging
🔄 /src/app/api/auth/signup/route.ts      - Activity logging
🔄 /src/app/api/auth/logout/route.ts      - Logout logging
🔄 /src/components/Settings.tsx           - Logout logging
```

## Security ✔️

✅ Password protected
✅ Session management
✅ Auto-logout on navigation
✅ Secure cookies
✅ Redirect unauthenticated users

## Custom Credentials

Edit `.env.local`:
```bash
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_strong_password
```

## Test It Out 🧪

1. Go to `/signup` → Create a test user
2. See it logged in admin panel
3. Go to `/` → Logout
4. Go to `/admin` → Login as admin
5. View the test user and activity logs

---

**Status**: ✅ Ready to use!
