# 🚀 START HERE - Supabase Migration

## What Just Happened?

Your student portal has been migrated from a custom backend to Supabase. All code is updated and ready to test.

## 6 Simple Steps to Complete Migration

### Step 1: Run SQL in Supabase (5 min)
1. Open: https://qnroaigdrpoceasbqtmh.supabase.co
2. Click **SQL Editor** (left sidebar)
3. Open the file `supabase-setup.sql` in your editor
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **RUN** button
7. You should see "Success. No rows returned"

### Step 2: Enable Email Auth (2 min)
1. In Supabase, click **Authentication** → **Providers**
2. Make sure **Email** is enabled (toggle ON)
3. Click **Authentication** → **Settings**
4. Find "Enable email confirmations" and turn it **OFF**
5. Click **Save**

### Step 3: Add Sample Data (3 min)
1. In Supabase SQL Editor, open `sample-data.sql`
2. Copy the **SCHEDULES section** (lines 10-280)
3. Paste and click **RUN**
4. This creates 4 course schedules (IT, Business, Engineering, Hospitality)

### Step 4: Create Test Account (5 min) ⚠️ DO THIS BEFORE STEP 5!
1. Open `index.html` in your browser
2. Click **Sign Up** and create this account:
   ```
   Student ID: GCC2024001
   First Name: John
   Last Name: Doe
   Email: john.doe@example.com
   Phone: 071 234 5678
   Address: 123 Main Street, Johannesburg
   Gender: male
   Password: Test123!
   ```
3. Click **Sign Up** button and wait for success

### Step 5: Add Student Info (2 min) ⚠️ ONLY AFTER STEP 4!
1. Go back to Supabase SQL Editor
2. Copy the **STUDENT INFO section** from `sample-data.sql` (the INSERT for GCC2024001)
3. Paste and click **RUN**
4. Should see "Success. 1 row affected"

### Step 6: Test Login (3 min)
1. Log in with Student ID: **GCC2024001** and Password: **Test123!**
2. Check that dashboard shows "Hi, JOHN DOE"
3. Check profile page shows all details
4. Check schedule page shows IT timetable
5. Try signing out

**See `TEST-ACCOUNTS.md` for 4 more test accounts to create**

## ✅ If Everything Works

Delete old files using this command (PowerShell):
```powershell
Remove-Item lib/auth.js, lib/get-data.js, lib/post-data.js, lib/local-storage.js, lib/check-login.js, config/config.js, assets/backvideo.mp4, assets/bg-video.mp4
```

Or CMD:
```cmd
del lib\auth.js lib\get-data.js lib\post-data.js lib\local-storage.js lib\check-login.js config\config.js assets\backvideo.mp4 assets\bg-video.mp4
```

## ❌ If Something Doesn't Work

Check `MIGRATION-GUIDE.md` for troubleshooting or let me know what error you're seeing.

## 📚 Additional Documentation

- **SUPABASE-MIGRATION-SUMMARY.md** - Overview of changes
- **MIGRATION-GUIDE.md** - Detailed guide with troubleshooting
- **DELETE-THESE-FILES.txt** - Complete list of files to remove

## What Changed?

**Before:**
- Custom Node.js backend on Render
- MongoDB database
- Manual session management
- Cost: $7-34/month

**After:**
- Supabase (all-in-one backend)
- PostgreSQL database
- Automatic session management
- Cost: $0/month (free tier)

## Need Help?

Common issues:
- **"User not found"** → Make sure you created account after running SQL
- **Console errors** → Check that Supabase URL/key in `config/supabase.js` is correct
- **Can't sign up** → Make sure email auth is enabled in Supabase

---

**You're all set! Start with Step 1 above.** 🎉
