# 🔐 Admin Panel & User Monitoring System

## Overview
A comprehensive admin dashboard that monitors all user sign-ups, logins, and stores complete user information including passwords in Supabase database.

## Features

### 1. **Complete User Monitoring**
- Track all sign-ups and logins
- View user credentials (username, password, email)
- See user profile information (name, age, grade, course)
- Monitor user roles (mentor/mentee)
- Track expertise and hobbies
- View join dates and last login times

### 2. **Admin Dashboard**
- Real-time statistics (Total Users, Mentors, Mentees)
- Users table with password visibility
- Detailed user profile sidebar
- Activity log with login/logout tracking
- Search functionality for quick user lookup
- Color-coded user roles and statuses

### 3. **Database Integration with Supabase**
- All user data stored in PostgreSQL
- Automatic activity logging on sign-up/sign-in
- Password hashing with bcrypt
- Plain password storage for admin viewing
- User expertise and hobbies tracking
- Activity log with IP addresses and user agents

## Database Schema

### Users Table (`users`)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  plain_password TEXT,              -- Stored for admin viewing
  grade TEXT DEFAULT 'College 1st Year',
  age INTEGER DEFAULT 18,
  course TEXT,
  status TEXT DEFAULT 'mentee',     -- 'mentor' or 'mentee'
  profile_picture TEXT,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Expertise Table (`user_expertise`)
```sql
CREATE TABLE user_expertise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expertise TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### User Hobbies Table (`user_hobbies`)
```sql
CREATE TABLE user_hobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  hobby TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Activity Logs Table (`activity_logs`)
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  action TEXT NOT NULL,            -- 'signin', 'signout', 'signup', 'admin_login'
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## Setup Instructions

### 1. **Supabase Project Setup**

Create these tables in your Supabase project:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  plain_password TEXT,
  grade TEXT DEFAULT 'College 1st Year',
  age INTEGER DEFAULT 18,
  course TEXT,
  status TEXT DEFAULT 'mentee',
  profile_picture TEXT,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_expertise table
CREATE TABLE user_expertise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expertise TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_hobbies table
CREATE TABLE user_hobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  hobby TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX idx_user_expertise_user_id ON user_expertise(user_id);
CREATE INDEX idx_user_hobbies_user_id ON user_hobbies(user_id);
```

### 2. **Environment Variables**

Set up your `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin
ADMIN_PASSWORD=your_secure_admin_password
```

### 3. **Install Dependencies**

```bash
npm install bcryptjs @supabase/supabase-js
```

## User Registration Flow

### Sign Up Process
1. User fills in profile information (name, username, password, expertise, hobbies)
2. Password is hashed using bcrypt
3. **Plain password stored in database** for admin viewing
4. User record created in Supabase with all profile data
5. Expertise and hobbies inserted into respective tables
6. Activity log created with "signin" action
7. IP address and user agent recorded

### Sign In Process
1. User enters username and password
2. Password verified against bcrypt hash
3. Last login timestamp updated
4. **Plain password updated** in database (latest password used)
5. Activity log created with "signin" action
6. User redirected to dashboard

## Admin Panel Features

### Statistics Dashboard
- **Total Users:** Count of all registered users
- **Mentors:** Count of users with mentor status
- **Mentees:** Count of users with mentee status
- **Recent Activity:** Count of recent login/logout events

### Users Table
Shows all users with columns:
- Avatar (profile picture)
- Username
- Name
- Email
- **Password** (plain text for admin viewing)
- Status (Mentor/Mentee)
- View Details button

### User Details Sidebar
Click "View Details" on any user to see:
- Profile picture and basic info
- Email address
- **Password in highlighted red box**
- Grade level
- Age
- Course
- Status
- Expertise tags
- Hobbies tags
- Account creation date

### Activity Log
Track all user activities:
- Username
- Action (signin, signout, signup, admin_login)
- Timestamp
- Visual indicator (login = green, logout = red)

### Search Functionality
- Search by username
- Search by full name
- Search by email
- Real-time filtering

## API Endpoints

### Sign Up
```
POST /api/auth/signup
Headers: Content-Type: application/json

Body: {
  "username": "johndoe",
  "password": "securepass123",
  "name": "John Doe",
  "email": "john@example.com",
  "grade": "College 1st Year",
  "age": 20,
  "course": "Computer Science",
  "status": "mentee",
  "hobbies": ["Gaming", "Reading"],
  "expertise": ["JavaScript", "React"]
}

Response: {
  "success": true,
  "profile": { ...user profile },
  "activityLog": { ...activity record }
}
```

### Sign In
```
POST /api/auth/signin
Headers: Content-Type: application/json

Body: {
  "username": "johndoe",
  "password": "securepass123"
}

Response: {
  "success": true,
  "profile": { ...user profile },
  "activityLog": { ...activity record }
}
```

### Admin Login
```
POST /api/admin/login
Headers: Content-Type: application/json

Body: {
  "password": "admin123"
}

Response: {
  "success": true,
  "token": "base64_encoded_token"
}
```

### Get Admin Data
```
GET /api/admin/data
Headers: 
  Authorization: Bearer <admin_token>

Response: {
  "success": true,
  "users": [ ...user records with passwords ],
  "activities": [ ...activity logs ],
  "totalUsers": 50,
  "totalMentors": 15,
  "totalMentees": 35,
  "recentLogins": [ ...recent login records ]
}
```

## Security Features

### Current Implementation
✅ Password hashing with bcrypt (10 rounds)
✅ Plain password stored for admin viewing
✅ Activity logging on sign-up/sign-in
✅ IP address and user agent tracking
✅ Admin authentication with token
✅ Service role key for server-side queries

### Recommended Enhancements
1. **Encrypt plain passwords** - Use encryption instead of storing plain text
2. **Audit logging** - Log all admin panel access
3. **Rate limiting** - Limit login attempts
4. **2FA** - Two-factor authentication for admin
5. **GDPR compliance** - Add user data export/deletion
6. **Session management** - Timeout admin sessions
7. **Activity retention** - Set policy for log retention
8. **Data masking** - Mask passwords in logs

## User Flow Diagrams

### Sign Up Flow
```
User fills form
    ↓
Submit to /api/auth/signup
    ↓
Hash password with bcrypt
    ↓
Create user in Supabase
    ↓
Store expertise & hobbies
    ↓
Create activity log (signin)
    ↓
Return to dashboard
    ↓
User can now message & access games
```

### Admin Monitoring Flow
```
Admin visits /admin/login
    ↓
Enter admin password
    ↓
Receive admin token
    ↓
Token stored in localStorage
    ↓
Redirected to /admin/dashboard
    ↓
Fetch all users & activities with token
    ↓
Display users table with passwords
    ↓
Click user to view full details
    ↓
See user password in red box
    ↓
Monitor activity logs
```

## Data Monitoring Features

### What Admin Can Monitor
✅ All user usernames and passwords
✅ User email addresses
✅ Personal information (name, age, grade)
✅ Course and expertise areas
✅ User role (mentor/mentee)
✅ Account creation dates
✅ Last login times
✅ All sign-in/sign-up activities
✅ IP addresses of login attempts
✅ Browser/device information
✅ User hobbies and interests
✅ Profile pictures

### Real-Time Updates
- Admin dashboard auto-refreshes data
- Activity logs update on every login
- User counts updated in real-time
- Last login timestamp tracks latest access

## Troubleshooting

### Admin Panel Not Loading
- Check if admin token is in localStorage
- Verify Supabase connection
- Check SUPABASE_SERVICE_ROLE_KEY in environment

### Passwords Not Showing
- Ensure plain_password column exists in users table
- Check that signup/signin APIs are updating plain_password
- Verify admin API is returning plainPassword in response

### Activity Logs Not Recording
- Check activity_logs table exists
- Verify user_id is correctly inserted
- Check database permissions

### Slow Admin Dashboard
- Add indexes to database tables
- Limit activity logs query (e.g., last 100)
- Optimize user expertise/hobbies queries

## Password Security Note

**⚠️ Important:** Storing plain passwords is a security risk. This is done for your admin monitoring needs, but consider:

1. **Encryption:** Encrypt passwords with a symmetric key instead of plain storage
2. **Masking:** Only show last 4 characters in UI, full password on-demand
3. **Audit:** Log every password view attempt
4. **Access Control:** Restrict admin password viewing to specific admins

Example encryption approach:
```typescript
import crypto from 'crypto'

const key = process.env.ENCRYPTION_KEY // 32-char hex string
const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)
const encrypted = cipher.update(password) + cipher.final('hex')
```

## Migration Guide

If you already have users stored locally, migrate to Supabase:

```typescript
import { supabase } from '@/lib/supabase'

async function migrateUsers() {
  const localUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
  
  for (const user of localUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    
    await supabase.from('users').insert({
      username: user.username,
      name: user.name,
      email: user.email,
      password_hash: passwordHash,
      plain_password: user.password,
      grade: user.grade,
      age: user.age,
      course: user.course,
      status: user.status,
      profile_picture: user.profilePicture,
      created_at: user.createdAt,
    })
  }
  
  localStorage.removeItem('all_users')
}
```

## Future Enhancements

1. **User Management Actions**
   - Ban/unban users
   - Reset user passwords
   - Modify user roles
   - Delete user accounts

2. **Advanced Analytics**
   - Login heatmap
   - User growth charts
   - Activity trends
   - Engagement metrics

3. **Notifications**
   - Alert on new user signup
   - Alert on suspicious activity
   - Daily activity digest
   - User milestone notifications

4. **Bulk Operations**
   - Bulk user import
   - Bulk password reset
   - Bulk user export
   - Batch role changes

5. **Advanced Security**
   - Password strength meter
   - Breach detection
   - Login attempt limits
   - Geographic tracking

6. **Compliance**
   - Data export (GDPR)
   - Account deletion
   - Activity audit trail
   - Data retention policies

## Support

For issues or questions about the admin system, check:
1. Supabase dashboard for data verification
2. Browser console for error messages
3. Network tab for API failures
4. Supabase logs for database errors
