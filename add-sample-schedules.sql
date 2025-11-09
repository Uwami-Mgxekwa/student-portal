-- ============================================
-- ADD SAMPLE SCHEDULES FOR IT STUDENTS
-- ============================================

-- Insert schedule for Information Technology - National Certificate
INSERT INTO schedules (course, certificate, year, schedule_data)
VALUES (
  'Information Technology',
  'National Certificate',
  '1',
  '{
    "Monday": [
      {"time": "08:00-10:00", "subject": "Programming Fundamentals", "room": "Lab 101"},
      {"time": "10:30-12:30", "subject": "Computer Systems", "room": "Room 205"}
    ],
    "Tuesday": [
      {"time": "08:00-10:00", "subject": "Database Basics", "room": "Lab 102"},
      {"time": "10:30-12:30", "subject": "Web Development", "room": "Lab 101"}
    ],
    "Wednesday": [
      {"time": "08:00-10:00", "subject": "Networking Fundamentals", "room": "Lab 103"},
      {"time": "10:30-12:30", "subject": "Mathematics for IT", "room": "Room 301"}
    ],
    "Thursday": [
      {"time": "08:00-10:00", "subject": "Programming Fundamentals", "room": "Lab 101"},
      {"time": "10:30-12:30", "subject": "Computer Systems", "room": "Room 205"}
    ],
    "Friday": [
      {"time": "08:00-10:00", "subject": "Web Development", "room": "Lab 101"},
      {"time": "10:30-12:30", "subject": "Database Basics", "room": "Lab 102"}
    ]
  }'::jsonb
)
ON CONFLICT (course, certificate, year) DO UPDATE
SET schedule_data = EXCLUDED.schedule_data;

-- Insert schedule for Information Technology - National Diploma
INSERT INTO schedules (course, certificate, year, schedule_data)
VALUES (
  'Information Technology',
  'National Diploma',
  '2',
  '{
    "Monday": [
      {"time": "08:00-10:00", "subject": "Advanced Programming", "room": "Lab 201"},
      {"time": "10:30-12:30", "subject": "Software Engineering", "room": "Room 305"},
      {"time": "14:00-16:00", "subject": "Mobile Development", "room": "Lab 202"}
    ],
    "Tuesday": [
      {"time": "08:00-10:00", "subject": "Database Management", "room": "Lab 203"},
      {"time": "10:30-12:30", "subject": "Network Security", "room": "Lab 204"}
    ],
    "Wednesday": [
      {"time": "08:00-10:00", "subject": "Cloud Computing", "room": "Lab 201"},
      {"time": "10:30-12:30", "subject": "Data Structures", "room": "Room 306"}
    ],
    "Thursday": [
      {"time": "08:00-10:00", "subject": "Advanced Programming", "room": "Lab 201"},
      {"time": "10:30-12:30", "subject": "Mobile Development", "room": "Lab 202"}
    ],
    "Friday": [
      {"time": "08:00-10:00", "subject": "Software Engineering", "room": "Room 305"},
      {"time": "10:30-12:30", "subject": "Project Work", "room": "Lab 201"}
    ]
  }'::jsonb
)
ON CONFLICT (course, certificate, year) DO UPDATE
SET schedule_data = EXCLUDED.schedule_data;

-- Insert schedule for Information Technology - Higher Certificate
INSERT INTO schedules (course, certificate, year, schedule_data)
VALUES (
  'Information Technology',
  'Higher Certificate',
  '1',
  '{
    "Monday": [
      {"time": "08:00-10:00", "subject": "Introduction to IT", "room": "Room 101"},
      {"time": "10:30-12:30", "subject": "Computer Literacy", "room": "Lab 105"}
    ],
    "Tuesday": [
      {"time": "08:00-10:00", "subject": "Basic Programming", "room": "Lab 101"},
      {"time": "10:30-12:30", "subject": "Office Applications", "room": "Lab 106"}
    ],
    "Wednesday": [
      {"time": "08:00-10:00", "subject": "Internet & Email", "room": "Lab 105"},
      {"time": "10:30-12:30", "subject": "IT Support Basics", "room": "Room 102"}
    ],
    "Thursday": [
      {"time": "08:00-10:00", "subject": "Basic Programming", "room": "Lab 101"},
      {"time": "10:30-12:30", "subject": "Computer Hardware", "room": "Lab 107"}
    ],
    "Friday": [
      {"time": "08:00-10:00", "subject": "Computer Literacy", "room": "Lab 105"},
      {"time": "10:30-12:30", "subject": "Practical Work", "room": "Lab 106"}
    ]
  }'::jsonb
)
ON CONFLICT (course, certificate, year) DO UPDATE
SET schedule_data = EXCLUDED.schedule_data;

-- Verify schedules were added
SELECT 
  course, 
  certificate, 
  year,
  created_at
FROM schedules
WHERE course = 'Information Technology'
ORDER BY certificate, year;
