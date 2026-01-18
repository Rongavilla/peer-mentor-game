# Database Admin Panel Setup

## What Was Added

I've created a comprehensive admin panel to view and track user data and authentication activity. Here's what was implemented:

### 1. **Admin Dashboard** (`/src/app/admin/page.tsx`)
   - **Location**: Visit `/admin` in your browser
   - **Features**:
     - View all registered users with complete profiles
     - See expandable user details (ID, status, grade, age, expertise, hobbies)
     - View authentication activity logs (sign-ins and sign-outs)
     - Refresh data button to reload from localStorage
     - Clear all data button for testing
     - Toggleable sensitive data visibility

### 2. **Database Utility Functions** (`/src/lib/database.ts`)
   - `saveUserToDatabase(profile)` - Saves or updates user data
   - `saveActivityLog(activityLog)` - Records login/logout events
   - `getAllUsers()` - Retrieves all users
   - `getActivityLogs()` - Retrieves all activity logs

### 3. **Updated Authentication Routes**
   - **Sign In** (`/api/auth/signin`): Now logs signin activity
   - **Sign Up** (`/api/auth/signup`): Now logs signin activity for new users
   - **Logout** (`/api/auth/logout`): Now logs signout activity

### 4. **Updated Components**
   - **SignIn Page** (`/src/app/signin/page.tsx`): Saves user data and activity logs on successful login
   - **SignUp Page** (`/src/app/signup/page.tsx`): Saves user data and activity logs on successful signup
   - **Settings Component** (`/src/components/Settings.tsx`): Logs logout activity when user signs out
   - **Header Component** (`/src/components/Header.tsx`): Added "Admin" link for easy access

## How It Works

### Data Storage
All data is stored in **browser localStorage** with two keys:
- `all_users` - JSON array of all user profiles
- `activity_logs` - JSON array of signin/signout events

### Activity Tracking
When users sign in/up, the system records:
- Username
- Action (signin/signout)
- Timestamp

## How to Use

1. **Access the Admin Panel**:
   - Click the "Admin" link in the header, OR
   - Navigate directly to `http://localhost:3000/admin`

2. **View Users Tab**:
   - See all registered users
   - Click on any user to expand and view full details
   - See expertise, hobbies, grade level, etc.

3. **View Activity Log**:
   - See all login/logout events sorted by most recent first
   - View exact timestamps of each action

4. **Manage Data**:
   - Click "Refresh Data" to reload the latest information
   - Click "Clear All Data" to wipe the database (for testing)
   - Toggle "Show Sensitive Data" to view/hide sensitive information

## Data Structure

### User Object
```typescript
{
  id: string;
  name: string;
  username: string;
  profilePicture: string;
  grade: string;
  course: string;
  age: number;
  hobbies: string[];
  expertise: string[];
  status: 'mentee' | 'mentor';
  createdAt: string;
  updatedAt: string;
}
```

### Activity Log Object
```typescript
{
  id: string;
  username: string;
  action: 'signin' | 'signout';
  timestamp: string;
}
```

## Notes

- Data persists only in the current browser (localStorage)
- Data is cleared when browser cache is cleared
- For production, you should migrate to a real database (Supabase, PostgreSQL, etc.)
- The admin panel currently has no authentication protection - add that when going to production

Enjoy monitoring your users! 🎉
