# Supabase Migration Guide

## Step 1: Set Up Supabase Database

1. Go to your Supabase project: https://qnroaigdrpoceasbqtmh.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Copy and paste the entire contents of `supabase-setup.sql`
4. Click **Run** to execute the SQL

This will create:
- `students` table (main user data)
- `student_info` table (academic details)
- `schedules` table (course timetables)
- Row Level Security policies
- Indexes for performance

## Step 2: Enable Email Auth

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Email** provider
3. Disable email confirmation (for testing): 
   - Go to **Authentication** → **Settings**
   - Turn OFF "Enable email confirmations"

## Step 3: Migrate Your Data (If You Have Existing Data)

If you have existing MongoDB data, you'll need to:

### Export from MongoDB:
```bash
# Export students
mongoexport --uri="YOUR_MONGODB_URI" --collection=students --out=students.json

# Export schedules
mongoexport --uri="YOUR_MONGODB_URI" --collection=schedules --out=schedules.json
```

### Import to Supabase:
1. Go to **Table Editor** in Supabase
2. For each table, click **Insert** → **Import data from CSV/JSON**
3. Map the fields accordingly

**Note:** You'll need to recreate user accounts since passwords are hashed differently.

## Step 4: Test the Application

1. Open `index.html` in your browser
2. Try signing up a new student
3. Log in with the credentials
4. Navigate through different pages to ensure everything works

## Step 5: Clean Up (After Testing)

Once everything works, delete these files:
- `lib/auth.js`
- `lib/get-data.js`
- `lib/post-data.js`
- `lib/local-storage.js`
- `lib/check-login.js`
- `config/config.js`

## Troubleshooting

### "User not found" error on login
- Make sure the student record exists in the `students` table
- Check that `student_id` matches what you're entering

### "Not authenticated" error
- Check browser console for detailed errors
- Verify Supabase URL and anon key in `config/supabase.js`

### Schedule not loading
- Ensure `student_info` table has data for the student
- Verify `schedules` table has matching course/certificate

## What Changed

### Before (Custom Backend):
- Custom Node.js API on Render
- Manual session management with localStorage
- Custom fetch wrappers
- MongoDB database

### After (Supabase):
- Direct database access via Supabase client
- Built-in auth with JWT tokens
- Automatic session management
- PostgreSQL database with RLS

### Benefits:
- ✅ No backend server to maintain
- ✅ Better security with Row Level Security
- ✅ Automatic session handling
- ✅ Real-time capabilities (can be added later)
- ✅ Simpler codebase (~50% less code)
- ✅ Free tier includes 500MB database + 50,000 monthly active users
