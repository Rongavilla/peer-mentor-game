# Environment Variables Template

Copy this file as `.env.local` and fill in your actual values from Supabase.

## Supabase Configuration

```env
# Your Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Your Supabase Anon Key (public key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Your Supabase Service Role Key (private key - keep secret!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Admin Configuration

```env
# Admin panel password (CHANGE THIS!)
ADMIN_PASSWORD=admin123

# Optional: Encryption key for passwords (if implementing encryption)
# ENCRYPTION_KEY=0123456789abcdef0123456789abcdef
```

## Optional: Next.js Configuration

```env
# Environment
NODE_ENV=development

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## How to Find These Values

### 1. Get Supabase URL

1. Log in to https://supabase.com
2. Go to your project
3. Click **Settings** (⚙️) → **API**
4. Copy the **Project URL**
5. Paste into `NEXT_PUBLIC_SUPABASE_URL`

### 2. Get Supabase Anon Key

1. In Settings → API
2. Find **"Project API keys"** section
3. Copy the **`anon` key** (public)
4. Paste into `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Get Service Role Key

1. In Settings → API
2. Find **"Project API keys"** section
3. Copy the **`service_role`** key (private)
4. Paste into `SUPABASE_SERVICE_ROLE_KEY`
5. ⚠️ **DO NOT commit this to git!**

### 4. Set Admin Password

1. Choose a strong password (20+ characters recommended)
2. Replace `admin123` with your password
3. Set `ADMIN_PASSWORD=your_new_password`

---

## Example `.env.local` File

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI1NzI4MDAsImV4cCI6MTk4ODE0MjgwfQ.K1234567890abcdefghijklmnopqrstuvwxyz
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MjU3MjgwMCwiZXhwIjoxOTg4MTQyODB9.M1234567890abcdefghijklmnopqrstuvwxyz

# Admin
ADMIN_PASSWORD=MyVerySecureAdminPassword2024!
```

---

## ⚠️ Important Security Notes

1. **Never commit `.env.local` to git**
   - Add to `.gitignore` (already done)
   - Use `.env.local` for local development only

2. **Keep service role key secret**
   - This has full database access
   - Never expose in browser
   - Never commit to repository

3. **Use strong admin password**
   - Minimum 12 characters
   - Mix of upper, lower, numbers, symbols
   - Example: `P@ssw0rd!MyAdmin2024$`

4. **Rotate keys regularly**
   - Change admin password quarterly
   - Regenerate service role key yearly
   - Document changes

5. **Use different keys for environments**
   - Local `.env.local` for development
   - `.env.production.local` for production
   - Never use development keys in production

---

## Setup Instructions

### Step 1: Copy Template
```bash
cp .env.example .env.local
```

### Step 2: Edit `.env.local`
```bash
# Open in your editor
nano .env.local
# or
code .env.local
```

### Step 3: Fill in Values
- Copy URL from Supabase
- Copy anon key from Supabase
- Copy service role key from Supabase
- Enter your admin password

### Step 4: Save & Restart
```bash
# Restart your development server
npm run dev
```

---

## Verification

After setup, verify everything works:

1. **Check environment loading**
   ```bash
   # This should not show any errors
   npm run dev
   ```

2. **Test sign-up**
   - Create a new user account
   - Check Supabase dashboard for new user

3. **Test admin panel**
   - Go to `/admin/login`
   - Enter your admin password
   - Should see admin dashboard

4. **Check password storage**
   - In Supabase, go to SQL Editor
   - Run: `SELECT username, plain_password FROM users LIMIT 1;`
   - Should see passwords stored

---

## Troubleshooting

### App Won't Start
- Check `.env.local` syntax
- Verify no typos in keys
- Ensure file is in project root

### Supabase Connection Error
- Verify URL is correct (starts with `https://`)
- Check anon key is valid
- Test in Supabase Studio

### Admin Password Not Working
- Check `ADMIN_PASSWORD` is set
- Verify no extra spaces
- Restart dev server after changing

### Passwords Not Stored
- Check `plain_password` column exists
- Verify service role key is correct
- Check Supabase database permissions

---

## Production Deployment

For production (e.g., Vercel, Netlify):

1. **Set environment variables in hosting dashboard**
   - Go to Settings → Environment Variables
   - Add all values from `.env.local`
   - **Never paste into repository**

2. **Use different values for production**
   - Create production Supabase keys
   - Use strong production admin password
   - Consider separate Supabase project

3. **Add to `.vercel.env` (Vercel example)**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
   SUPABASE_SERVICE_ROLE_KEY=prod-service-role-key
   ADMIN_PASSWORD=prod-admin-password
   ```

---

## Example Keys Explanation

### NEXT_PUBLIC_SUPABASE_URL
- Format: `https://xxxxx.supabase.co`
- This is your project URL
- Safe to be public (in browser)

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- Format: Long JWT token starting with `eyJ...`
- This is the anonymous/public key
- Used in browser for client-side queries
- Safe to be public but limited access

### SUPABASE_SERVICE_ROLE_KEY
- Format: Long JWT token starting with `eyJ...`
- This is the admin/full access key
- **KEEP THIS SECRET!**
- Only used on server (never in browser)
- Has full database access

### ADMIN_PASSWORD
- Any string you choose
- Used for admin panel login
- Should be strong (20+ characters)
- Example: `P@ssw0rd!MyAdmin2024$`

---

Need help? Check out:
- Supabase Docs: https://supabase.com/docs
- NextJS Env Variables: https://nextjs.org/docs/basic-features/environment-variables
