# Admin Dashboard Database Integration

## Overview
The admin panel is now fully connected to your Supabase database and allows you to monitor all users and their activities in real-time.

## What's Connected

### 1. Admin Login (`/admin/login`)
- ✅ Authenticates via admin password
- ✅ Logs all login attempts (successful and failed) to the database
- ✅ Tracks IP address and user agent for security audit
- ✅ Creates session token for admin dashboard access
- ✅ Back button to return to sign-in page

### 2. Admin Dashboard (`/admin/dashboard`)
- ✅ Displays real-time statistics:
  - **Total Users**: Count of all registered users
  - **Mentors**: Count of users with 'mentor' status
  - **Mentees**: Count of users with 'mentee' status
  - **Recent Activity**: Total login/logout events logged

### 3. Users Tab
Shows detailed information about all registered users with:
- **Avatar**: Profile picture (auto-generated or uploaded)
- **Username**: User's unique handle
- **Name**: Full name
- **Email**: Contact email
- **Grade**: Educational level (School/College year)
- **Course**: Field of study
- **Age**: User age
- **Status**: Mentor or Mentee role
- **Joined**: Account creation date
- **Expertise**: Skills and areas of expertise

**Features:**
- Search functionality (by name, username, or email)
- Pagination support for large user lists
- Status badges with color coding

### 4. Activity Log Tab
Tracks all user activities including:
- **Username**: Who performed the action
- **Action**: Type of action (signin, signout, admin_login, admin_login_failed)
- **Timestamp**: Exact time of the action
- **Icons**: Visual indicators for action type

**Automatic Tracking:**
- User sign-ups
- User sign-ins
- User sign-outs
- Admin login attempts

## Database Tables Used

### `users`
- Stores all user registration and profile information
- Connected fields: username, email, name, grade, course, age, status, profile_picture

### `user_expertise`
- Stores skills and expertise for each user
- Used for mentor matching and profile display

### `user_hobbies`
- Stores hobbies/interests for each user
- Used for mentor matching

### `activity_logs`
- Tracks all user and admin actions
- Logs include: username, action type, timestamp, IP address, user agent

## How to Use

### Access Admin Panel
1. Go to Sign-In page (`/signin`)
2. Click "Admin Login" button
3. Enter your admin password (default: `admin123`)
4. You'll be redirected to the Admin Dashboard

### View User Information
- Click on the "Users" tab
- Search for specific users using the search bar
- View complete user profiles with all details

### Monitor Activity
- Click on the "Activity Log" tab
- See all user actions in chronological order
- Track admin login attempts
- Identify usage patterns

### Logout
- Click the "Logout" button in the top-right corner
- You'll be returned to the admin login page

## Security Features

✅ **Token-based Authentication**: Admin token stored securely in localStorage
✅ **Activity Logging**: All login attempts are recorded
✅ **IP Tracking**: Captures IP address for security audits
✅ **User Agent Logging**: Tracks device/browser information
✅ **Failed Login Attempts**: Records failed authentication tries

## Environment Configuration

Make sure these environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=your_admin_password
```

## API Endpoints

### Admin Login
```
POST /api/admin/login
Body: { password: "admin123" }
Response: { success: true, token: "admin:..." }
```

### Admin Data
```
GET /api/admin/data
Headers: { Authorization: "Bearer admin:..." }
Response: { 
  success: true, 
  users: [...],
  activities: [...],
  totalUsers: 0,
  totalMentors: 0,
  totalMentees: 0
}
```

## What's Visible in the Dashboard

### Statistics Cards
- Real-time user counts
- Mentor/Mentee breakdown
- Recent activity metrics

### Users Table
- Sortable and searchable user list
- Complete profile information
- User expertise display
- Status indicators

### Activity Timeline
- Chronological log of all events
- Filter by action type
- Timestamp information

## Next Steps (Optional Enhancements)

You can further enhance the admin dashboard by:
1. Adding user deletion/editing capabilities
2. Implementing activity filters (by date, action type)
3. Adding data export features (CSV, PDF)
4. Creating user role management
5. Adding system statistics and analytics
6. Implementing real-time notifications for new signups

## Support

If you need to troubleshoot:
1. Check browser console for errors
2. Verify admin password in environment variables
3. Ensure Supabase service role key has database permissions
4. Check database tables exist and have correct schema
