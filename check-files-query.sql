-- Run this in Supabase SQL Editor to check your files

-- Check what's in resources table
SELECT 
  id,
  title,
  year,
  category,
  is_active,
  file_url,
  created_at
FROM resources
ORDER BY created_at DESC;

-- Check your student's year
-- Replace 'YOUR_STUDENT_ID' with your actual student ID
SELECT *
FROM student_info
WHERE student_id = 'YOUR_STUDENT_ID';

-- If you don't know your student ID, run this to see all students:
SELECT *
FROM student_info
ORDER BY created_at DESC
LIMIT 10;
