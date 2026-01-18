# 📊 Database Table Components - Guide

## What You Got

I created **2 table components** that connect to your Supabase database:

### 1. **Full Database Explorer** (Page Component)
**File:** `src/app/database-explorer/page.tsx`
**Purpose:** Browse ALL tables in your database
**Features:**
- ✅ See list of all tables
- ✅ Click table to view data
- ✅ Search/filter data
- ✅ Export to CSV
- ✅ Beautiful UI with gradients
- ✅ Loading states & error handling

**Access it:** `http://localhost:3000/database-explorer`

---

### 2. **Simple Users Table** (Component)
**File:** `src/components/DatabaseUsersTable.tsx`
**Purpose:** Display users in a table format
**Features:**
- ✅ Shows all users from database
- ✅ Displays: ID, Username, Name, Email, Status, Created Date
- ✅ Refresh button to reload data
- ✅ Status badges (Mentor/Mentee)
- ✅ Error handling

**Use it:** Import and add to any page

---

## How to Use Them

### Option 1: Use Database Explorer (Easiest)

```bash
# 1. Run your app
npm run dev

# 2. Go to this URL
http://localhost:3000/database-explorer

# 3. Done! 🎉
# - See all your database tables
# - Click a table to view data
# - Search and filter
# - Export to CSV
```

### Option 2: Add Users Table to Dashboard

**Edit:** `src/app/dashboard/page.tsx`

**Add this import:**
```tsx
import DatabaseUsersTable from '@/components/DatabaseUsersTable'
```

**Add this to your JSX:**
```tsx
<div>
  {/* Your existing dashboard content */}
  
  <DatabaseUsersTable />
</div>
```

**Result:** Users table appears on dashboard!

---

## Database Explorer Features

### 🎯 Main Features

1. **Table List (Left Sidebar)**
   - Shows all tables in your database
   - Click to load table data
   - Refresh button

2. **Data Viewer (Main Area)**
   - Displays table data in rows and columns
   - Shows up to 100 rows at a time
   - Column headers for each field

3. **Search**
   - Type to search across all columns
   - Real-time filtering
   - Shows filtered count

4. **Export**
   - Download table as CSV file
   - Opens in Excel/Google Sheets
   - Perfect for backups

5. **Error Handling**
   - Shows clear error messages
   - Helpful alerts
   - Debug information

---

## Your Database Tables

These tables will appear in the explorer:

```
✅ users
   ├─ ID, username, email, name, password_hash
   ├─ grade, age, course, status
   ├─ profile_picture, last_login
   └─ created_at, updated_at

✅ user_expertise
   ├─ ID, user_id, expertise
   └─ created_at

✅ user_hobbies
   ├─ ID, user_id, hobby
   └─ created_at

✅ activity_logs
   ├─ ID, user_id, username
   ├─ action, ip_address, user_agent
   └─ timestamp

✅ messages
   ├─ ID, sender_id, receiver_id
   ├─ content, is_read
   └─ created_at

✅ user_badges
   ├─ ID, user_id, badge_name
   ├─ description, points
   └─ earned_at

✅ user_practice_progress
   ├─ ID, user_id, topic
   ├─ progress, last_accessed
   └─ updated_at
```

---

## Quick Start (5 Minutes)

### Step 1: Run Your App
```bash
npm run dev
```

### Step 2: Open Database Explorer
```
http://localhost:3000/database-explorer
```

### Step 3: Click a Table
- Click "users" in the left sidebar
- See all users appear in the table
- Use search to find specific users

### Step 4: Explore Features
- **Search:** Type a username to filter
- **Export:** Click "Export CSV" to download
- **Refresh:** Click refresh icon to reload

---

## Adding to Dashboard

### Full Instructions

**1. Edit dashboard file:**
```bash
# Open this file
src/app/dashboard/page.tsx
```

**2. Add import at top:**
```tsx
import DatabaseUsersTable from '@/components/DatabaseUsersTable'
```

**3. Add component to JSX:**
```tsx
export default function Dashboard() {
  return (
    <div>
      {/* Your existing content */}
      
      {/* Add this */}
      <DatabaseUsersTable />
    </div>
  )
}
```

**4. Save and view:**
```bash
# Save the file
# Refresh browser
# Users table appears! ✅
```

---

## Creating More Tables

Want to display other tables? Easy!

### Create a New Table Component

**Create file:** `src/components/DatabaseTable.tsx`

```tsx
'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  tableName: string // 'messages', 'activity_logs', etc
}

export default function DatabaseTable({ tableName }: Props) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [tableName])

  const fetchData = async () => {
    try {
      const { data: result, error: err } = await supabase
        .from(tableName)
        .select('*')
        .limit(100)

      if (err) throw err
      setData(result || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-4 text-gray-400">Loading...</div>
  if (error) return <div className="p-4 text-red-400">Error: {error}</div>

  return (
    <div className="bg-white/10 rounded-lg p-4 mt-4">
      <h3 className="text-white font-bold mb-4">{tableName}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-white/10">
              {data[0] && Object.keys(data[0]).map(col => (
                <th key={col} className="px-4 py-2 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-white/5">
                {Object.values(row).map((val, j) => (
                  <td key={j} className="px-4 py-2">
                    {String(val).substring(0, 30)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

**Use it:**
```tsx
<DatabaseTable tableName="messages" />
<DatabaseTable tableName="activity_logs" />
<DatabaseTable tableName="user_badges" />
```

---

## Customizing Tables

### Change Column Order

**In `DatabaseUsersTable.tsx`, modify the table headers:**

```tsx
<thead>
  <tr>
    <th>Username</th>    {/* Moved to first */}
    <th>Name</th>        {/* Then name */}
    <th>Email</th>       {/* Then email */}
    <th>Status</th>
    <th>Created</th>
  </tr>
</thead>
```

### Add More Columns

**Add to table headers:**
```tsx
<th>Grade</th>
<th>Age</th>
<th>Course</th>
```

**Add to table data:**
```tsx
<td>{user.grade}</td>
<td>{user.age}</td>
<td>{user.course}</td>
```

### Change Colors

**Edit CSS classes:**
```tsx
// Change from this
className="bg-blue-500/30 text-blue-300"

// To this
className="bg-purple-500/30 text-purple-300"
```

---

## Troubleshooting

### "No tables found"
**Solution:** Your Supabase tables might have different names
- Check your Supabase database
- Update table names in the code
- Or use the Database Explorer to see actual names

### "Connection error"
**Solution:** Check your `.env.local` file
- Make sure `NEXT_PUBLIC_SUPABASE_URL` is set
- Make sure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Restart the app: `npm run dev`

### "No data showing"
**Solution:** The table might be empty
- Check Supabase dashboard
- Add some data first
- Then reload the page

### "Search not working"
**Solution:** Make sure you're in the Database Explorer
- Search works in `/database-explorer`
- Not all table components have search

---

## Features Explained

### Database Explorer (`/database-explorer`)

| Feature | How It Works |
|---------|-------------|
| **Table List** | Shows all tables, click to view |
| **Data Viewer** | Displays table rows and columns |
| **Search** | Filter data in real-time |
| **Export** | Download as CSV file |
| **Refresh** | Reload data from database |
| **Error Handling** | Shows helpful error messages |

### Simple Table Component

| Feature | How It Works |
|---------|-------------|
| **Auto Load** | Fetches data when component mounts |
| **Status Badge** | Shows Mentor/Mentee status |
| **Row Count** | Shows total number of rows |
| **Hover Effect** | Rows highlight on hover |
| **Error Display** | Shows errors clearly |

---

## Performance Notes

✅ **Fast:**
- Limits to 100 rows (prevents slow loading)
- Search is instant (client-side)
- Loading states show progress

✅ **Scalable:**
- Works with small or large tables
- Handles many columns
- Pagination can be added

---

## Next Steps

### Immediate
1. Run `npm run dev`
2. Go to `http://localhost:3000/database-explorer`
3. Click on a table and explore your data

### Short Term
1. Add `DatabaseUsersTable` to your dashboard
2. Customize colors/columns to match your style
3. Create tables for other data (messages, activity logs, etc)

### Long Term
1. Add pagination (show 10 rows per page)
2. Add sorting (click column to sort)
3. Add filtering (dropdown filters)
4. Add data editing (update/delete from UI)
5. Add real-time updates (see changes instantly)

---

## Files Created

```
✅ src/app/database-explorer/page.tsx
   └─ Full database explorer with all features

✅ src/components/DatabaseUsersTable.tsx
   └─ Reusable users table component

✅ DATABASE_TABLES_GUIDE.md (this file)
   └─ Complete documentation
```

---

## Summary

You now have:

✅ **Database Explorer** - Browse any table  
✅ **Users Table** - Show users on dashboard  
✅ **Reusable Components** - Create more tables easily  
✅ **Export Feature** - Download data as CSV  
✅ **Search & Filter** - Find data quickly  
✅ **Error Handling** - Clear error messages  
✅ **Beautiful UI** - Matches your design  

---

## Ready to Use!

```bash
# 1. Run app
npm run dev

# 2. View database
http://localhost:3000/database-explorer

# 3. Or add to dashboard
# Edit src/app/dashboard/page.tsx
# Import DatabaseUsersTable
# Add <DatabaseUsersTable /> to JSX

# Done! 🎉
```

Enjoy exploring your database! 📊
