# ✅ Database Integration Checklist

## Quick Setup (5 minutes)

### 1. Run SQL Migration
- [ ] Go to [Supabase Dashboard](https://supabase.com)
- [ ] Navigate to your project
- [ ] Click **SQL Editor**
- [ ] Create a **New Query**
- [ ] Copy-paste all SQL from `supabase/migrations/001_initial_schema.sql`
- [ ] Click **Run**
- [ ] Wait for "Success" message

### 2. Verify Environment
- [ ] Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Check `.env.local` has `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Both credentials are from your Supabase project

### 3. Install Dependencies
```bash
npm install bcryptjs --save
```
- [ ] Command runs without errors
- [ ] `bcryptjs` appears in `package.json`

### 4. Test Connection
- [ ] Start dev server: `npm run dev`
- [ ] Go to `http://localhost:3000/test-db`
- [ ] Click "Test Connection" button
- [ ] See green "✅ Connection Successful" message

## Full Feature Checklist

### Authentication
- [ ] Sign up creates user in database
- [ ] Password is hashed with bcrypt
- [ ] Sign in validates against database
- [ ] Sign in logs activity automatically
- [ ] Sign out logs activity automatically
- [ ] Last login timestamp is updated

### User Profiles
- [ ] Can update profile information
- [ ] Can add/edit expertise areas
- [ ] Can add/edit hobbies
- [ ] Profile updates sync to database
- [ ] Changes are reflected immediately

### Activity Logging
- [ ] Admin panel shows signin/signout events
- [ ] Activity logs include timestamps
- [ ] Activity logs include user agent
- [ ] Activity logs include IP address
- [ ] Old activity logs are preserved

### Matching Algorithm
- [ ] Finding mentees works
- [ ] Finding mentors works
- [ ] Filters by expertise
- [ ] Filters by course
- [ ] Calculates compatibility score
- [ ] Returns top 10 matches

## Verification Steps

### Verify Tables Exist
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should show:
- [ ] `users`
- [ ] `user_expertise`
- [ ] `user_hobbies`
- [ ] `activity_logs`

### Verify Sample Data
```sql
SELECT COUNT(*) FROM users;
```
Should show number > 0 after you sign up

### Check Indexes
```sql
SELECT indexname FROM pg_indexes 
WHERE tablename = 'users';
```

Should show:
- [ ] `idx_users_username`
- [ ] `idx_users_email`
- [ ] `idx_users_status`

## Testing Workflow

### 1. Test Signup
1. Go to `http://localhost:3000/signup`
2. Fill in form:
   - Name: "Test User"
   - Username: "testuser123"
   - Password: "password123"
3. Click Sign Up
4. Should be redirected to dashboard
5. Check Supabase: `SELECT * FROM users;`
6. New user should appear

### 2. Test Signin
1. Sign out from dashboard
2. Go to `http://localhost:3000/signin`
3. Enter username: "testuser123"
4. Enter password: "password123"
5. Click Sign In
6. Should be redirected to dashboard

### 3. Test Activity Logs
1. Do multiple signins/signouts
2. Go to `/admin/login`
3. Login: admin / admin123
4. Go to Activity tab
5. Should see all signin/signout events

### 4. Test Profile Update
1. In dashboard, edit profile
2. Add expertise and hobbies
3. Click save
4. Refresh page
5. Changes should persist

### 5. Test Matching
1. Create 2+ users with different roles
2. User 1: Sign up as mentee
3. User 2: Sign up as mentor
4. User 1: Click "Find Matches"
5. Should see User 2 in results

## File Structure

```
peer-mentor-game/
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql ✅
├── src/
│   ├── app/
│   │   ├── test-db/
│   │   │   └── page.tsx ✅
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── signin/route.ts ✅
│   │   │   │   ├── signup/route.ts ✅
│   │   │   │   └── logout/route.ts ✅
│   │   │   ├── matching/route.ts ✅
│   │   │   └── profile/
│   │   │       └── update/route.ts ✅
│   ├── lib/
│   │   └── supabase.ts ✅
│   ├── types/
│   │   └── index.ts ✅
│   └── ...
├── .env.local ✅
└── package.json ✅
```

## Troubleshooting

### Issue: "Cannot find module 'bcryptjs'"
**Solution**: 
```bash
npm install bcryptjs --save
npm install @types/bcryptjs --save-dev
```

### Issue: "Supabase connection error"
**Solution**:
- Check `.env.local` credentials
- Verify Supabase project status
- Test with `/test-db` page
- Check browser console for specific errors

### Issue: "Table doesn't exist"
**Solution**:
- Run SQL migration again
- Ensure all SQL ran successfully
- Check Supabase SQL Editor for errors
- Refresh page and try again

### Issue: "Password mismatch on signin"
**Solution**:
- Verify password is correct
- Check if user exists in database
- Make sure bcryptjs installed correctly
- Look for errors in browser console

### Issue: "Activity logs not showing"
**Solution**:
- Check admin credentials (admin/admin123)
- Verify signin/signout endpoints updated
- Check localStorage for local logs
- Refresh admin dashboard

## Rollback Instructions

If you need to remove all data:

### Remove All Data (Keep Tables)
```sql
DELETE FROM activity_logs;
DELETE FROM user_hobbies;
DELETE FROM user_expertise;
DELETE FROM users;
```

### Remove All Tables
```sql
DROP TABLE activity_logs;
DROP TABLE user_hobbies;
DROP TABLE user_expertise;
DROP TABLE users;
```

## Performance Tips

### Query Optimization
- Indexes are already created for common queries
- Expertise and hobbies queries are optimized
- Activity logs sorted by timestamp

### Connection Pooling
- Supabase handles connection pooling
- No need for additional configuration

### Caching Strategy
- Consider caching user profiles
- Cache expertise/hobbies after fetch
- Update cache on profile changes

## Next Steps

1. ✅ Run SQL migration
2. ✅ Test database connection
3. ✅ Sign up a test user
4. ✅ Verify user in Supabase
5. ✅ Test signin flow
6. ✅ Check activity logs
7. ✅ Test matching
8. ✅ Monitor performance

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Bcryptjs Package](https://www.npmjs.com/package/bcryptjs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Status**: ✅ Ready to Deploy
**Estimated Setup Time**: 5 minutes
**Last Updated**: January 12, 2026
