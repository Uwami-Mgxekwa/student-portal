-- ============================================
-- ADD SAMPLE SCHEDULES FOR IT STUDENTS
-- ============================================

-- Delete existing schedules first (if any)
DELETE FROM schedules WHERE course = 'Information Technology';

-- Insert schedule for Information Technology - National Certificate
INSERT INTO schedules (course, certificate, schedule_data)
VALUES (
  'Information Technology',
  'National Certificate',
  '{
    "COURSE": "Information Technology",
    "CERTIFICATE": "National Certificate",
    "TABLE": [
      {
        "DAY": "Monday",
        "MODULES": [
          "08:00-10:00 Programming Fundamentals (Lab 101)",
          "10:00-12:00 Computer Systems (Room 205)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Practical Work (Lab 101)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      },
      {
        "DAY": "Tuesday",
        "MODULES": [
          "08:00-10:00 Database Basics (Lab 102)",
          "10:00-12:00 Web Development (Lab 101)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Programming Fundamentals (Lab 101)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      },
      {
        "DAY": "Wednesday",
        "MODULES": [
          "08:00-10:00 Networking Fundamentals (Lab 103)",
          "10:00-12:00 Mathematics for IT (Room 301)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Computer Systems (Room 205)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      },
      {
        "DAY": "Thursday",
        "MODULES": [
          "08:00-10:00 Web Development (Lab 101)",
          "10:00-12:00 Database Basics (Lab 102)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Networking Fundamentals (Lab 103)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      },
      {
        "DAY": "Friday",
        "MODULES": [
          "08:00-10:00 Programming Fundamentals (Lab 101)",
          "10:00-12:00 Mathematics for IT (Room 301)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Practical Work (Lab 101)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      }
    ]
  }'::jsonb
);

-- Insert schedule for Information Technology - National Diploma
INSERT INTO schedules (course, certificate, schedule_data)
VALUES (
  'Information Technology',
  'National Diploma',
  '{
    "COURSE": "Information Technology",
    "CERTIFICATE": "National Diploma",
    "TABLE": [
      {
        "DAY": "Monday",
        "MODULES": [
          "08:00-10:00 Advanced Programming (Lab 201)",
          "10:00-12:00 Software Engineering (Room 305)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Mobile Development (Lab 202)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      },
      {
        "DAY": "Tuesday",
        "MODULES": [
          "08:00-10:00 Database Management (Lab 203)",
          "10:00-12:00 Network Security (Lab 204)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Practical Work (Lab 201)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      },
      {
        "DAY": "Wednesday",
        "MODULES": [
          "08:00-10:00 Cloud Computing (Lab 201)",
          "10:00-12:00 Data Structures (Room 306)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Advanced Programming (Lab 201)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      },
      {
        "DAY": "Thursday",
        "MODULES": [
          "08:00-10:00 Mobile Development (Lab 202)",
          "10:00-12:00 Software Engineering (Room 305)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Database Management (Lab 203)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      },
      {
        "DAY": "Friday",
        "MODULES": [
          "08:00-10:00 Project Work (Lab 201)",
          "10:00-12:00 Network Security (Lab 204)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Cloud Computing (Lab 201)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      }
    ]
  }'::jsonb
);

-- Insert schedule for Information Technology - Higher Certificate
INSERT INTO schedules (course, certificate, schedule_data)
VALUES (
  'Information Technology',
  'Higher Certificate',
  '{
    "COURSE": "Information Technology",
    "CERTIFICATE": "Higher Certificate",
    "TABLE": [
      {
        "DAY": "Monday",
        "MODULES": [
          "08:00-10:00 Introduction to IT (Room 101)",
          "10:00-12:00 Computer Literacy (Lab 105)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Practical Work (Lab 105)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      },
      {
        "DAY": "Tuesday",
        "MODULES": [
          "08:00-10:00 Basic Programming (Lab 101)",
          "10:00-12:00 Office Applications (Lab 106)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Computer Literacy (Lab 105)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      },
      {
        "DAY": "Wednesday",
        "MODULES": [
          "08:00-10:00 Internet & Email (Lab 105)",
          "10:00-12:00 IT Support Basics (Room 102)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Basic Programming (Lab 101)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      },
      {
        "DAY": "Thursday",
        "MODULES": [
          "08:00-10:00 Computer Hardware (Lab 107)",
          "10:00-12:00 Office Applications (Lab 106)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 IT Support Basics (Room 102)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      },
      {
        "DAY": "Friday",
        "MODULES": [
          "08:00-10:00 Practical Work (Lab 106)",
          "10:00-12:00 Introduction to IT (Room 101)",
          "12:00-13:00 Lunch Break",
          "13:00-15:00 Computer Hardware (Lab 107)",
          "15:00-17:00 Study Time",
          "",
          "",
          ""
        ]
      }
    ]
  }'::jsonb
);

-- Verify schedules were added
SELECT 
  course, 
  certificate, 
  created_at
FROM schedules
WHERE course = 'Information Technology'
ORDER BY certificate;
