-- Check which student IDs exist in the students table
SELECT student_id, first_name, last_name, email
FROM students
ORDER BY created_at DESC
LIMIT 20;
