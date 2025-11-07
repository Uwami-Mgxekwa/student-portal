# 🔍 Login Issue - Debugging Guide

## Current Situation

You're getting: **"Invalid login credentials"** when trying to log in with Student ID: `0111`

## Possible Causes

### 1. Student Record Doesn't Exist
The signup might have failed due to RLS (which you've now disabled).

### 2. Wrong Student ID
You might be using a different Student ID than what you signed up with.

### 3. Wrong Password
The password doesn't match what you used during signup.

### 4. Email Confirmation Required
Supabase might require email confirmation (should be disabled).

---

## 🔧 Step-by-Step Debugging

### Step 1: Check if Student Record Exists

1. Go to Supabase SQL Editor
2. Run this query:
   ```sql
   SELECT * FROM students WHERE student_id = '0111';
   ```

**Expected Result:**
- Should return 1 row with your student data
- Should show: student_id, email, first_name, last_name, etc.

**If NO results:**
- The signup didn't create the student record
- You need to sign up again (RLS is now disabled, so it should work)

**If it DOES return a row:**
- Note the email address shown
- Continue to Step 2

---

### Step 2: Check Auth Users

1. In Supabase SQL Editor, run:
   ```sql
   SELECT id, email, created_at FROM auth.users;
   ```

**Expected Result:**
- Should show at least one user
- Email should match the student record

**If NO results:**
- The auth user wasn't created during signup
- Sign up again

**If email doesn't match:**
- There's a mismatch between auth and student records
- Sign up again with a new Student ID

---

### Step 3: Verify Email Confirmation is Disabled

1. Go to Supabase Dashboard
2. Click **Authentication** → **Settings**
3. Find "Enable email confirmations"
4. Make sure it's **OFF** (disabled)
5. Click **Save**

---

### Step 4: Try Signing Up Again

Since RLS is now disabled, signup should work:

1. Go to: `http://localhost:8000/pages/sign-up.html`
2. Fill in:
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
3. Click "Sign Up"
4. Check console for any errors
5. If successful, you'll be redirected to dashboard

---

### Step 5: Try Logging In

1. Go to: `http://localhost:8000/pages/login.html`
2. Enter:
   ```
   Student ID: GCC2024001
   Password: Test123!
   ```
3. Click "Login"
4. Check console for detailed logs

---

## 🔍 Enhanced Logging

I've added detailed console logs to help debug. When you try to log in now, you'll see:

```
Looking up student ID: GCC2024001
Student lookup result: {email: "john.doe@example.com"} null
Attempting login with email: john.doe@example.com
Login attempt result: {user: {...}} null
```

**If you see:**
- "Student ID not found" → The student record doesn't exist, sign up first
- "Invalid password" → Wrong password, try again or reset
- "Student lookup failed" → Database query failed, check Supabase connection

---

## 🆘 Quick Fixes

### Fix 1: Clear Everything and Start Fresh

1. In Supabase SQL Editor:
   ```sql
   -- Delete all test data
   DELETE FROM student_info;
   DELETE FROM students;
   
   -- Delete auth users (go to Authentication → Users in Supabase dashboard)
   -- Click on each user and delete them
   ```

2. Sign up again with fresh data

### Fix 2: Check What's in the Database

Run this in Supabase SQL Editor:
```sql
-- See all students
SELECT student_id, email, first_name, last_name FROM students;

-- See all auth users
SELECT email, created_at FROM auth.users;

-- See if they're linked
SELECT 
  s.student_id,
  s.email as student_email,
  u.email as auth_email
FROM students s
LEFT JOIN auth.users u ON s.id = u.id;
```

Share the results if you need help interpreting them.

---

## ✅ Expected Working Flow

1. **Sign Up:**
   - Creates auth user in `auth.users`
   - Creates student record in `students` table
   - Both linked by `id` (UUID)

2. **Login:**
   - Enter Student ID (e.g., "GCC2024001")
   - System looks up email from `students` table
   - Uses email + password to authenticate with Supabase Auth
   - If successful, redirects to dashboard

---

## 📝 What to Share for Help

If still not working, share:

1. **Result of this query:**
   ```sql
   SELECT student_id, email FROM students WHERE student_id = '0111';
   ```

2. **Console output when you try to log in** (all the logs)

3. **Did signup show any errors?** (check console during signup)

4. **Is email confirmation disabled in Supabase?**

---

## 🎯 Most Likely Solution

Based on the error, the most likely issue is:

**The student record with ID "0111" doesn't exist in the database.**

**Solution:**
1. Sign up again (RLS is now disabled, so it should work)
2. Use a proper Student ID format like "GCC2024001"
3. Then try logging in with that Student ID

Try signing up with the test account details from TEST-ACCOUNTS.md!
