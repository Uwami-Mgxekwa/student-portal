-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================
-- Run this AFTER running supabase-setup.sql
-- ============================================

-- NOTE: For user accounts, you need to sign up through the app first
-- because Supabase Auth handles password hashing.
-- After signing up, you can update the student_info table with this data.

-- ============================================
-- SAMPLE SCHEDULES DATA
-- ============================================

-- Information Technology - National Certificate Schedule
INSERT INTO schedules (course, certificate, schedule_data) VALUES
('Information Technology', 'National Certificate', '{
  "COURSE": "Information Technology",
  "CERTIFICATE": "National Certificate",
  "TABLE": [
    {
      "DAY": "Monday",
      "MODULES": [
        "Database Design",
        "Database Design",
        "Web Development",
        "Web Development",
        "Break",
        "Programming Logic",
        "Programming Logic",
        "Free Period"
      ]
    },
    {
      "DAY": "Tuesday",
      "MODULES": [
        "Systems Analysis",
        "Systems Analysis",
        "Networking Basics",
        "Networking Basics",
        "Break",
        "Web Development",
        "Web Development",
        "Free Period"
      ]
    },
    {
      "DAY": "Wednesday",
      "MODULES": [
        "Programming Logic",
        "Programming Logic",
        "Database Design",
        "Database Design",
        "Break",
        "IT Support",
        "IT Support",
        "Free Period"
      ]
    },
    {
      "DAY": "Thursday",
      "MODULES": [
        "Web Development",
        "Web Development",
        "Systems Analysis",
        "Systems Analysis",
        "Break",
        "Networking Basics",
        "Networking Basics",
        "Free Period"
      ]
    },
    {
      "DAY": "Friday",
      "MODULES": [
        "IT Support",
        "IT Support",
        "Programming Logic",
        "Programming Logic",
        "Break",
        "Project Work",
        "Project Work",
        "Free Period"
      ]
    }
  ]
}');

-- Business Management - National Diploma Schedule
INSERT INTO schedules (course, certificate, schedule_data) VALUES
('Business Management', 'National Diploma', '{
  "COURSE": "Business Management",
  "CERTIFICATE": "National Diploma",
  "TABLE": [
    {
      "DAY": "Monday",
      "MODULES": [
        "Business Economics",
        "Business Economics",
        "Financial Accounting",
        "Financial Accounting",
        "Break",
        "Marketing Management",
        "Marketing Management",
        "Free Period"
      ]
    },
    {
      "DAY": "Tuesday",
      "MODULES": [
        "Human Resources",
        "Human Resources",
        "Business Law",
        "Business Law",
        "Break",
        "Financial Accounting",
        "Financial Accounting",
        "Free Period"
      ]
    },
    {
      "DAY": "Wednesday",
      "MODULES": [
        "Marketing Management",
        "Marketing Management",
        "Business Economics",
        "Business Economics",
        "Break",
        "Operations Management",
        "Operations Management",
        "Free Period"
      ]
    },
    {
      "DAY": "Thursday",
      "MODULES": [
        "Business Law",
        "Business Law",
        "Human Resources",
        "Human Resources",
        "Break",
        "Strategic Management",
        "Strategic Management",
        "Free Period"
      ]
    },
    {
      "DAY": "Friday",
      "MODULES": [
        "Operations Management",
        "Operations Management",
        "Strategic Management",
        "Strategic Management",
        "Break",
        "Case Studies",
        "Case Studies",
        "Free Period"
      ]
    }
  ]
}');

-- Engineering - Higher Certificate Schedule
INSERT INTO schedules (course, certificate, schedule_data) VALUES
('Engineering', 'Higher Certificate', '{
  "COURSE": "Engineering",
  "CERTIFICATE": "Higher Certificate",
  "TABLE": [
    {
      "DAY": "Monday",
      "MODULES": [
        "Engineering Maths",
        "Engineering Maths",
        "Technical Drawing",
        "Technical Drawing",
        "Break",
        "Workshop Practice",
        "Workshop Practice",
        "Free Period"
      ]
    },
    {
      "DAY": "Tuesday",
      "MODULES": [
        "Mechanics",
        "Mechanics",
        "Materials Science",
        "Materials Science",
        "Break",
        "Engineering Maths",
        "Engineering Maths",
        "Free Period"
      ]
    },
    {
      "DAY": "Wednesday",
      "MODULES": [
        "Technical Drawing",
        "Technical Drawing",
        "Mechanics",
        "Mechanics",
        "Break",
        "CAD Design",
        "CAD Design",
        "Free Period"
      ]
    },
    {
      "DAY": "Thursday",
      "MODULES": [
        "Materials Science",
        "Materials Science",
        "Workshop Practice",
        "Workshop Practice",
        "Break",
        "Electrical Systems",
        "Electrical Systems",
        "Free Period"
      ]
    },
    {
      "DAY": "Friday",
      "MODULES": [
        "CAD Design",
        "CAD Design",
        "Electrical Systems",
        "Electrical Systems",
        "Break",
        "Project Work",
        "Project Work",
        "Free Period"
      ]
    }
  ]
}');

-- Hospitality Management - National Certificate Schedule
INSERT INTO schedules (course, certificate, schedule_data) VALUES
('Hospitality Management', 'National Certificate', '{
  "COURSE": "Hospitality Management",
  "CERTIFICATE": "National Certificate",
  "TABLE": [
    {
      "DAY": "Monday",
      "MODULES": [
        "Food & Beverage",
        "Food & Beverage",
        "Customer Service",
        "Customer Service",
        "Break",
        "Kitchen Operations",
        "Kitchen Operations",
        "Free Period"
      ]
    },
    {
      "DAY": "Tuesday",
      "MODULES": [
        "Hotel Management",
        "Hotel Management",
        "Event Planning",
        "Event Planning",
        "Break",
        "Food & Beverage",
        "Food & Beverage",
        "Free Period"
      ]
    },
    {
      "DAY": "Wednesday",
      "MODULES": [
        "Customer Service",
        "Customer Service",
        "Hotel Management",
        "Hotel Management",
        "Break",
        "Hospitality Law",
        "Hospitality Law",
        "Free Period"
      ]
    },
    {
      "DAY": "Thursday",
      "MODULES": [
        "Event Planning",
        "Event Planning",
        "Kitchen Operations",
        "Kitchen Operations",
        "Break",
        "Tourism Management",
        "Tourism Management",
        "Free Period"
      ]
    },
    {
      "DAY": "Friday",
      "MODULES": [
        "Hospitality Law",
        "Hospitality Law",
        "Tourism Management",
        "Tourism Management",
        "Break",
        "Practical Training",
        "Practical Training",
        "Free Period"
      ]
    }
  ]
}');

-- ============================================
-- INSTRUCTIONS FOR CREATING TEST ACCOUNTS
-- ============================================

/*
IMPORTANT: You cannot insert users directly into the auth.users table.
You must create accounts through the application signup form.

Here are 5 test accounts to create:

1. STUDENT ID: GCC2024001
   Name: John Doe
   Email: john.doe@example.com
   Password: Test123!
   Phone: 071 234 5678
   Address: 123 Main Street, Johannesburg
   Gender: male

2. STUDENT ID: GCC2024002
   Name: Sarah Smith
   Email: sarah.smith@example.com
   Password: Test123!
   Phone: 082 345 6789
   Address: 456 Oak Avenue, Pretoria
   Gender: female

3. STUDENT ID: GCC2024003
   Name: Michael Johnson
   Email: michael.j@example.com
   Password: Test123!
   Phone: 083 456 7890
   Address: 789 Pine Road, Sandton
   Gender: male

4. STUDENT ID: GCC2024004
   Name: Emily Williams
   Email: emily.w@example.com
   Password: Test123!
   Phone: 084 567 8901
   Address: 321 Elm Street, Midrand
   Gender: female

5. STUDENT ID: GCC2024005
   Name: David Brown
   Email: david.brown@example.com
   Password: Test123!
   Phone: 085 678 9012
   Address: 654 Maple Drive, Centurion
   Gender: male

AFTER creating these accounts through the signup form, run the SQL below
to add their academic information.
*/

-- ============================================
-- STUDENT INFO DATA (Run AFTER signup)
-- ============================================

-- ⚠️ IMPORTANT: You MUST create the account through the signup form FIRST!
-- The error "Key (student_id)=(GCC2024001) is not present in table students"
-- means you haven't signed up with that Student ID yet.
--
-- CORRECT ORDER:
-- 1. Go to your app and click "Sign Up"
-- 2. Fill in the form with Student ID: GCC2024001 (and other details)
-- 3. Submit the signup form
-- 4. THEN come back here and run this SQL
--
-- This SQL will fail if you haven't signed up first!

-- Student 1: John Doe - IT Student
INSERT INTO student_info (student_id, campus, course, faculty, certificate, year)
VALUES ('GCC2024001', 'Main Campus', 'Information Technology', 'Faculty of ICT', 'National Certificate', '2024')
ON CONFLICT (student_id) DO UPDATE SET
  campus = EXCLUDED.campus,
  course = EXCLUDED.course,
  faculty = EXCLUDED.faculty,
  certificate = EXCLUDED.certificate,
  year = EXCLUDED.year;

-- Student 2: Sarah Smith - Business Student
INSERT INTO student_info (student_id, campus, course, faculty, certificate, year)
VALUES ('GCC2024002', 'Main Campus', 'Business Management', 'Faculty of Commerce', 'National Diploma', '2024')
ON CONFLICT (student_id) DO UPDATE SET
  campus = EXCLUDED.campus,
  course = EXCLUDED.course,
  faculty = EXCLUDED.faculty,
  certificate = EXCLUDED.certificate,
  year = EXCLUDED.year;

-- Student 3: Michael Johnson - Engineering Student
INSERT INTO student_info (student_id, campus, course, faculty, certificate, year)
VALUES ('GCC2024003', 'North Campus', 'Engineering', 'Faculty of Engineering', 'Higher Certificate', '2024')
ON CONFLICT (student_id) DO UPDATE SET
  campus = EXCLUDED.campus,
  course = EXCLUDED.course,
  faculty = EXCLUDED.faculty,
  certificate = EXCLUDED.certificate,
  year = EXCLUDED.year;

-- Student 4: Emily Williams - Hospitality Student
INSERT INTO student_info (student_id, campus, course, faculty, certificate, year)
VALUES ('GCC2024004', 'South Campus', 'Hospitality Management', 'Faculty of Tourism', 'National Certificate', '2024')
ON CONFLICT (student_id) DO UPDATE SET
  campus = EXCLUDED.campus,
  course = EXCLUDED.course,
  faculty = EXCLUDED.faculty,
  certificate = EXCLUDED.certificate,
  year = EXCLUDED.year;

-- Student 5: David Brown - IT Student
INSERT INTO student_info (student_id, campus, course, faculty, certificate, year)
VALUES ('GCC2024005', 'Main Campus', 'Information Technology', 'Faculty of ICT', 'National Certificate', '2024')
ON CONFLICT (student_id) DO UPDATE SET
  campus = EXCLUDED.campus,
  course = EXCLUDED.course,
  faculty = EXCLUDED.faculty,
  certificate = EXCLUDED.certificate,
  year = EXCLUDED.year;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check schedules
SELECT course, certificate FROM schedules;

-- Check student info (run after creating accounts)
SELECT student_id, course, certificate, campus FROM student_info;

-- Check students (run after creating accounts)
SELECT student_id, first_name, last_name, email FROM students;
