-- FIX STUDENT YEAR ISSUE
-- This updates students who have calendar years (2025, 2024) to study years (1, 2, 3)

-- First, check what years students currently have
SELECT student_id, year, course, certificate
FROM student_info
ORDER BY created_at DESC;

-- If you see years like "2025", "2024", "2023", run these updates:

-- Update students with year 2025 to Year 1
UPDATE student_info
SET year = '1'
WHERE year = '2025';

-- Update students with year 2024 to Year 2
UPDATE student_info
SET year = '2'
WHERE year = '2024';

-- Update students with year 2023 to Year 3
UPDATE student_info
SET year = '3'
WHERE year = '2023';

-- Verify the changes
SELECT student_id, year, course, certificate
FROM student_info
ORDER BY created_at DESC;

-- Now your students should see year-specific files!
