# 🗄️ Essential Database Tables Only

## What You Actually Need

```
┌─────────────────────────────────────────────────┐
│         PEER MENTOR GAME DATABASE               │
│              (CLEANED UP)                        │
└─────────────────────────────────────────────────┘

┌─────────────────┐
│  users          │  ✅ ESSENTIAL
├─────────────────┤
│ • id            │
│ • username      │
│ • password_hash │
│ • plain_password│ (for admin viewing)
│ • email         │
│ • name          │
│ • age, grade    │
│ • course        │
│ • status        │ (mentor/mentee)
│ • profile_pic   │
│ • last_login    │
│ • created_at    │
└──────────┬──────┘
           │
           ├─── FK ──→ ┌──────────────────┐
           │           │ user_expertise   │ ✅ ESSENTIAL
           │           ├──────────────────┤
           │           │ • id             │
           │           │ • user_id        │
           │           │ • expertise      │
           │           └──────────────────┘
           │
           ├─── FK ──→ ┌──────────────────┐
           │           │ user_hobbies     │ ✅ ESSENTIAL
           │           ├──────────────────┤
           │           │ • id             │
           │           │ • user_id        │
           │           │ • hobby          │
           │           └──────────────────┘
           │
           ├─── FK ──→ ┌──────────────────┐
           │           │ activity_logs    │ ✅ ESSENTIAL
           │           ├──────────────────┤
           │           │ • id             │
           │           │ • user_id        │
           │           │ • username       │
           │           │ • action         │
           │           │ • ip_address     │
           │           │ • user_agent     │
           │           │ • timestamp      │
           │           └──────────────────┘
           │
           ├─── FK ──→ ┌──────────────────┐
           │           │ messages         │ ⭐ OPTIONAL
           │           ├──────────────────┤
           │           │ • id             │
           │           │ • sender_id      │
           │           │ • recipient_id   │
           │           │ • text           │
           │           │ • read           │
           │           │ • created_at     │
           │           └──────────────────┘
           │
           ├─── FK ──→ ┌──────────────────┐
           │           │ user_practice... │ ⭐ OPTIONAL
           │           ├──────────────────┤
           │           │ • id             │
           │           │ • user_id        │
           │           │ • practice_topic │
           │           │ • score          │
           │           │ • completed      │
           │           └──────────────────┘
           │
           └─── FK ──→ ┌──────────────────┐
                       │ user_badges      │ ⭐ OPTIONAL
                       ├──────────────────┤
                       │ • id             │
                       │ • user_id        │
                       │ • badge_name     │
                       │ • points_earned  │
                       │ • earned_at      │
                       └──────────────────┘
```

---

## Tables to REMOVE

```
❌ admin_notifications     → Not used in code
❌ admins                  → Redundant (use users instead)
❌ profiles                → Redundant (use users instead)
```

---

## Summary

### ✅ KEEP (7 tables)
```
1. users
2. user_expertise
3. user_hobbies
4. activity_logs
5. messages
6. user_practice_progress
7. user_badges
```

### ❌ DELETE (3 tables)
```
1. admin_notifications
2. admins
3. profiles (if not used)
```

---

## Cleanup Steps

### 1. Run This SQL in Supabase
```sql
-- Remove unnecessary tables
DROP TABLE IF EXISTS admin_notifications CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;  -- Uncomment if sure

-- Verify what's left
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 2. Expected Output
```
activity_logs
messages
user_badges
user_expertise
user_hobbies
user_practice_progress
users
```

### 3. No Code Changes Needed!
Your app already uses the correct tables.

---

## Why Remove These?

| Table | Why Remove |
|-------|-----------|
| **admin_notifications** | Admin dashboard doesn't use it; tracking logins via activity_logs |
| **admins** | All admin management done via users table; status field handles roles |
| **profiles** | Redundant with users table; all data already in users |

---

## Data Flow (After Cleanup)

```
User Signup
    ↓
Insert into users table
    ↓
Insert expertise into user_expertise
    ↓
Insert hobbies into user_hobbies
    ↓
Create activity log
    ↓
User ready to login

User Login
    ↓
Query users table
    ↓
Verify password_hash
    ↓
Update last_login
    ↓
Create activity log
    ↓
Return to dashboard
```

---

## No Risk!

✅ No breaking changes
✅ No code modifications needed
✅ No data loss (just removing empty/redundant tables)
✅ Can rollback if needed

Just run the cleanup SQL and you're done!

---

## File Location

```
supabase/migrations/003_cleanup_unnecessary_tables.sql
```

Copy & paste into Supabase SQL Editor and run!
