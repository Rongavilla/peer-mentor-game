# 🔧 Database Setup Quick Reference

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Your App (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Frontend Pages                                      │  │
│  │  ├── /signup          → API /auth/signup            │  │
│  │  ├── /signin          → API /auth/signin            │  │
│  │  ├── /dashboard       → API /profile/update         │  │
│  │  ├── /matching        → API /matching               │  │
│  │  └── /admin/dashboard → View all data               │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes (Updated)                                │  │
│  │  ├── /api/auth/signin      ✅ Database             │  │
│  │  ├── /api/auth/signup      ✅ Database             │  │
│  │  ├── /api/auth/logout      ✅ Activity Log         │  │
│  │  ├── /api/matching         ✅ Database Queries     │  │
│  │  └── /api/profile/update   ✅ Database Updates     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│             Supabase (PostgreSQL)                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  users                                               │  │
│  │  ├─ id (UUID)                                       │  │
│  │  ├─ username (UNIQUE)                               │  │
│  │  ├─ password_hash (HASHED)                          │  │
│  │  ├─ name                                            │  │
│  │  ├─ grade, course, age                              │  │
│  │  ├─ status (mentor/mentee)                          │  │
│  │  └─ timestamps                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  user_expertise ──→ user_hobbies                    │  │
│  │  ├─ user_id (FK)   ├─ user_id (FK)                │  │
│  │  └─ expertise       └─ hobby                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  activity_logs                                       │  │
│  │  ├─ user_id (FK)                                    │  │
│  │  ├─ username                                        │  │
│  │  ├─ action (signin/signout)                         │  │
│  │  ├─ ip_address                                      │  │
│  │  ├─ user_agent                                      │  │
│  │  └─ timestamp                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Sign Up Flow
```
User Input (signup form)
        ↓
   POST /api/auth/signup
        ↓
   Hash Password (bcrypt)
        ↓
   Insert into users table
        ↓
   Insert into activity_logs (signin)
        ↓
   Return User Profile
        ↓
   Store in Zustand (userStore)
        ↓
   Redirect to /dashboard
```

### Sign In Flow
```
User Input (signin form)
        ↓
   POST /api/auth/signin
        ↓
   Query users by username
        ↓
   Compare hashed password (bcrypt)
        ↓
   If match:
   - Update last_login
   - Insert into activity_logs (signin)
   - Return User Profile
        ↓
   Store in Zustand (userStore)
        ↓
   Redirect to /dashboard
```

### Matching Flow
```
User searches for matches
        ↓
   POST /api/matching
        ↓
   Query users with opposite status
        ↓
   Join with expertise and hobbies
        ↓
   Calculate compatibility score
        ↓
   Sort by score
        ↓
   Return top 10 matches
        ↓
   Display in UI
```

## Installation Checklist

### Prerequisites
- ✅ Node.js 18+
- ✅ npm or yarn
- ✅ Supabase account and project

### Step-by-Step

#### 1. Install Dependencies
```bash
npm install bcryptjs --save
```
Expected output: "added 1 package"

#### 2. Verify Environment
Check `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://gpfyuvgxsddaeqdetqbl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

#### 3. Run SQL Migration
```
Location: supabase/migrations/001_initial_schema.sql
Action: Copy → Supabase SQL Editor → Run
```

#### 4. Test Connection
```
URL: http://localhost:3000/test-db
Action: Click "Test Connection"
Expected: Green success message
```

#### 5. Test Features
```
Sign Up → Check DB → Sign In → Check Logs → Test Matching
```

## Monitoring Commands

### Check Database Status
```sql
-- All tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- User count
SELECT COUNT(*) as total_users FROM users;

-- Activity count
SELECT COUNT(*) as total_activities FROM activity_logs;

-- Recent signins
SELECT username, timestamp FROM activity_logs 
WHERE action = 'signin' 
ORDER BY timestamp DESC LIMIT 10;

-- Mentors and mentees
SELECT status, COUNT(*) FROM users GROUP BY status;
```

### Check Indexes
```sql
-- All indexes on users table
SELECT indexname FROM pg_indexes WHERE tablename = 'users';

-- All indexes on activity_logs
SELECT indexname FROM pg_indexes WHERE tablename = 'activity_logs';
```

## Error Codes

| Error | Cause | Solution |
|-------|-------|----------|
| Cannot find bcryptjs | Not installed | `npm install bcryptjs --save` |
| Supabase connection error | Bad credentials | Check `.env.local` |
| Table not found | Migration not run | Run SQL in Supabase |
| Username exists | Duplicate signup | Try different username |
| Password mismatch | Wrong password | Check password |
| Row not found | Nonexistent user | Check username |

## Performance Tips

### Query Optimization
```javascript
// ✅ Good - Uses indexed column
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('username', username);

// ❌ Slow - Searches all rows
const { data } = await supabase
  .from('users')
  .select('*')
  .ilike('profile_picture', '%...');
```

### Batch Operations
```javascript
// ✅ Good - Single transaction
await supabase.from('activity_logs').insert([
  { user_id, username, action: 'signin' },
  { user_id, username, action: 'signout' },
]);
```

## Backup & Recovery

### Backup Data
```sql
-- Export all users
SELECT * FROM users;

-- Export all activity
SELECT * FROM activity_logs;
```

### Restore Data
```sql
-- Delete all (careful!)
DELETE FROM activity_logs;
DELETE FROM users;

-- Reimport data
INSERT INTO users (...) VALUES (...);
```

## Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ RLS enabled on tables
- ✅ Activity logs are append-only
- ✅ API routes validated
- ✅ Credentials in `.env.local`
- ✅ HTTPS recommended for production

## Deployment Notes

### Before Production
1. Increase bcrypt rounds for security
2. Add rate limiting to auth endpoints
3. Enable HTTPS everywhere
4. Set strong admin password
5. Enable backups in Supabase
6. Review RLS policies
7. Monitor activity logs
8. Set up alerts

### Production Environment
```bash
NEXT_PUBLIC_SUPABASE_URL=prod-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-key
NODE_ENV=production
```

## Debugging

### Check Logs
Browser Console → Network Tab → Click request → Response

### Test Endpoint
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### Check Database
Supabase Dashboard → SQL Editor → Run queries

### View Activity
Admin Panel → Activity Tab → See all logs

---

**Setup Time**: 5 minutes
**Verification Time**: 5 minutes
**Total**: 10 minutes to full integration

Ready to deploy! 🚀
