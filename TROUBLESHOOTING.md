# 🆘 Troubleshooting Guide

## ❌ Error: "Key (student_id)=(GCC2024001) is not present in table students"

### What This Means:
You're trying to add student info for an account that doesn't exist yet.

### Solution:
You **MUST** create the account through the signup form **BEFORE** running the student_info SQL.

### Correct Order:

#### ✅ DO THIS:
1. Open your app (index.html)
2. Click "Sign Up"
3. Fill in the form:
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
4. Click "Sign Up" button
5. Wait for success message
6. **NOW** go to Supabase SQL Editor
7. Run the student_info SQL for GCC2024001

#### ❌ DON'T DO THIS:
1. ~~Run student_info SQL first~~ ← This will fail!
2. ~~Then try to sign up~~ ← Wrong order

---

## ❌ Error: "User not found" on Login

### Possible Causes:

**1. You haven't signed up yet**
- Solution: Go to signup page and create account first

**2. Wrong Student ID**
- Solution: Use the exact Student ID you signed up with (case-sensitive)

**3. Account exists but no student record**
- Check in Supabase: `SELECT * FROM students;`
- If empty, the signup didn't work - check browser console for errors

---

## ❌ Error: "Invalid login credentials"

### Possible Causes:

**1. Wrong password**
- Solution: Use the exact password you set during signup
- Test accounts use: `Test123!`

**2. Email not verified (if confirmations are ON)**
- Solution: Go to Supabase → Authentication → Settings
- Turn OFF "Enable email confirmations"

---

## ❌ Schedule Page Shows "Error loading schedule"

### Possible Causes:

**1. No student_info record**
- Solution: Run the student_info SQL for your student ID
- Check: `SELECT * FROM student_info WHERE student_id = 'GCC2024001';`

**2. No matching schedule**
- Solution: Make sure you ran the schedules SQL from sample-data.sql
- Check: `SELECT * FROM schedules;` (should show 4 rows)

**3. Course/Certificate mismatch**
- The schedule must match your student_info course and certificate exactly
- Check both tables:
  ```sql
  SELECT course, certificate FROM student_info WHERE student_id = 'GCC2024001';
  SELECT course, certificate FROM schedules;
  ```

---

## ❌ Profile Page Shows "N/A" for Everything

### Cause:
No student_info record exists for your account.

### Solution:
1. Make sure you signed up first
2. Run the student_info SQL for your student ID
3. Refresh the profile page

---

## ❌ "Not authenticated" Error

### Possible Causes:

**1. Wrong Supabase URL or Key**
- Check `config/supabase.js`
- Should be:
  ```javascript
  const SUPABASE_URL = 'https://qnroaigdrpoceasbqtmh.supabase.co'
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  ```

**2. Session expired**
- Solution: Log out and log back in

**3. Browser cache issue**
- Solution: Clear browser cache or try incognito mode

---

## ❌ Signup Form Doesn't Work

### Check Browser Console (F12):

**1. CORS Error**
- This shouldn't happen with Supabase
- Check that you're using the correct Supabase URL

**2. "Email already registered"**
- You already have an account with that email
- Use a different email or log in instead

**3. "Student ID already exists"**
- You already have an account with that Student ID
- Use a different Student ID or log in instead

---

## ❌ Can't See Any Data in Supabase Tables

### Check Row Level Security (RLS):

**1. In Supabase, go to Table Editor**
- Click on a table (e.g., students)
- You might see "No rows" even if data exists

**2. To see all data (for debugging):**
```sql
-- Temporarily disable RLS to see data
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
SELECT * FROM students;
-- Re-enable RLS after checking
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
```

**3. Or use SQL Editor:**
```sql
-- This bypasses RLS
SELECT * FROM students;
SELECT * FROM student_info;
SELECT * FROM schedules;
```

---

## 🔍 Debugging Checklist

### Step 1: Check Database Setup
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should show: students, student_info, schedules
```

### Step 2: Check Schedules
```sql
SELECT course, certificate FROM schedules;
-- Should show 4 rows
```

### Step 3: Check Your Account
```sql
-- Replace with your student ID
SELECT * FROM students WHERE student_id = 'GCC2024001';
SELECT * FROM student_info WHERE student_id = 'GCC2024001';
```

### Step 4: Check Browser Console
1. Open browser (F12)
2. Go to Console tab
3. Look for red error messages
4. Share the error message if you need help

---

## 📝 Common Setup Mistakes

### ❌ Mistake 1: Running SQL in Wrong Order
**Wrong:**
1. Run student_info SQL
2. Sign up

**Correct:**
1. Run supabase-setup.sql
2. Run schedules SQL
3. Sign up through app
4. Run student_info SQL

### ❌ Mistake 2: Not Enabling Email Auth
- Go to Authentication → Providers
- Enable "Email" provider
- Turn OFF email confirmations

### ❌ Mistake 3: Using Wrong Login Credentials
- Login uses **Student ID** (not email)
- Example: `GCC2024001` (not `john.doe@example.com`)

### ❌ Mistake 4: Forgetting to Refresh Page
- After running student_info SQL, refresh the profile/schedule page

---

## 🆘 Still Having Issues?

### Collect This Information:

1. **What step are you on?**
   - Setting up database?
   - Creating account?
   - Logging in?
   - Viewing a specific page?

2. **What's the exact error message?**
   - Check browser console (F12)
   - Check Supabase SQL Editor error

3. **What have you tried?**
   - List the steps you've completed

4. **Check these:**
   ```sql
   -- Run in Supabase SQL Editor
   SELECT COUNT(*) as schedule_count FROM schedules;
   SELECT COUNT(*) as student_count FROM students;
   SELECT COUNT(*) as student_info_count FROM student_info;
   ```

Share these counts and the error message!
