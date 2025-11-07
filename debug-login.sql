-- ============================================
-- DEBUG LOGIN ISSUE
-- ============================================
-- Run these queries in Supabase SQL Editor to debug
-- ============================================

-- 1. Check if the student record exists
SELECT * FROM students WHERE student_id = '0111';

-- 2. Check all students in the table
SELECT student_id, email, first_name, last_name FROM students;

-- 3. Check if there are any auth users
SELECT id, email, created_at FROM auth.users;

-- 4. Check if the student_id matches an auth user
SELECT 
  s.student_id,
  s.email,
  s.first_name,
  s.last_name,
  u.email as auth_email,
  u.created_at
FROM students s
LEFT JOIN auth.users u ON s.id = u.id
WHERE s.student_id = '0111';

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- Query 1 should return 1 row with your student data
-- Query 2 should show all students you've created
-- Query 3 should show auth users (should match students)
-- Query 4 should show the student linked to auth user

-- ============================================
-- IF NO RESULTS:
-- ============================================
-- The signup didn't work properly. The student record wasn't created.
-- This could happen if:
-- 1. RLS was blocking the insert (you've disabled it now, so this is fixed)
-- 2. The signup failed but didn't show an error
-- 3. You signed up with a different student ID

-- ============================================
-- SOLUTION IF NO STUDENT FOUND:
-- ============================================
-- Try signing up again now that RLS is disabled
-- Use these details:
--   Student ID: GCC2024001
--   First Name: John
--   Last Name: Doe
--   Email: john.doe@example.com
--   Phone: 071 234 5678
--   Address: 123 Main Street
--   Gender: male
--   Password: Test123!
