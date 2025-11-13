-- ============================================
-- DELETE DUMMY USERS SCRIPT
-- ============================================
-- This script helps you delete test/dummy users safely

-- ============================================
-- OPTION 1: DELETE SPECIFIC USER
-- ============================================
-- Replace 'STUDENT_ID' with the actual student ID you want to delete

-- Step 1: Delete from student_info first (has foreign key)
DELETE FROM student_info 
WHERE student_id = 'kingjosh';

-- Step 2: Delete from students table
DELETE FROM students 
WHERE student_id = 'kingjosh';

-- Step 3: Delete from auth.users (optional, if you want to remove login)
-- Get the user ID first:
SELECT id FROM auth.users WHERE email LIKE '%kingjosh%';

-- Then delete (replace UUID with actual ID from above):
-- DELETE FROM auth.users WHERE id = 'uuid-here';

-- ============================================
-- OPTION 2: DELETE MULTIPLE USERS AT ONCE
-- ============================================
-- Delete multiple users by student_id

DELETE FROM student_info 
WHERE student_id IN ('kingjosh', 'user2', 'user3');

DELETE FROM students 
WHERE student_id IN ('kingjosh', 'user2', 'user3');

-- ============================================
-- OPTION 3: DELETE ALL TEST USERS
-- ============================================
-- BE CAREFUL! This deletes ALL users except specific ones

-- First, see all users:
SELECT student_id, first_name, last_name, email 
FROM students 
ORDER BY created_at DESC;

-- Delete all EXCEPT the ones you want to keep:
-- DELETE FROM student_info 
-- WHERE student_id NOT IN ('keep_this_user', 'and_this_user');

-- DELETE FROM students 
-- WHERE student_id NOT IN ('keep_this_user', 'and_this_user');

-- ============================================
-- OPTION 4: DELETE USERS CREATED TODAY
-- ============================================
-- Delete users created in the last 24 hours

DELETE FROM student_info 
WHERE created_at > NOW() - INTERVAL '1 day';

DELETE FROM students 
WHERE created_at > NOW() - INTERVAL '1 day';

-- ============================================
-- OPTION 5: SAFE CLEANUP - VIEW FIRST, DELETE LATER
-- ============================================

-- Step 1: See all users and their info
SELECT 
  s.student_id,
  s.first_name,
  s.last_name,
  s.email,
  si.year,
  si.course,
  s.created_at
FROM students s
LEFT JOIN student_info si ON s.student_id = si.student_id
ORDER BY s.created_at DESC;

-- Step 2: Identify which ones to delete
-- Step 3: Use OPTION 1 or OPTION 2 above to delete them

-- ============================================
-- QUICK DELETE TEMPLATE
-- ============================================
-- Copy this template and replace STUDENT_ID with actual IDs

-- Delete one user:
DELETE FROM student_info WHERE student_id = 'STUDENT_ID';
DELETE FROM students WHERE student_id = 'STUDENT_ID';

-- Delete multiple users:
DELETE FROM student_info WHERE student_id IN ('ID1', 'ID2', 'ID3');
DELETE FROM students WHERE student_id IN ('ID1', 'ID2', 'ID3');

-- ============================================
-- VERIFY DELETION
-- ============================================
-- Check if users are deleted

SELECT COUNT(*) as total_students FROM students;
SELECT COUNT(*) as total_student_info FROM student_info;

-- ============================================
-- NOTES
-- ============================================
-- 1. Always delete from student_info FIRST (child table)
-- 2. Then delete from students (parent table)
-- 3. Auth users can be left (they won't be able to login without student record)
-- 4. Or delete auth users if you want to completely remove them
-- 5. Make a backup before deleting if unsure!

-- ============================================
-- EMERGENCY: RESTORE IF DELETED BY MISTAKE
-- ============================================
-- Unfortunately, Supabase doesn't have automatic backups on free tier
-- You'll need to re-create the users manually
-- Consider exporting data before mass deletions:

-- Export all users to CSV:
-- Go to Table Editor > students > Export as CSV
