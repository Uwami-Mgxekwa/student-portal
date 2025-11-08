# Year-Specific Content System Setup Guide

## Overview
The student portal now supports year-specific content, restricts signup to IT students only, and includes creator credits.

## What Changed

### 1. Signup Restrictions
✅ **IT Students Only**
- Course dropdown is now locked to "Information Technology"
- Students cannot select other courses
- All signups are automatically IT students

✅ **Year Selection Updated**
- Changed from calendar years (2025, 2024, 2023) to study years (Year 1, Year 2, Year 3)
- Students select their current year of study during signup
- Year is stored in the database for content filtering

### 2. Year-Specific Content System
✅ **Database Schema**
- New `resources` table for managing PDF files
- Resources can be assigned to specific years (1, 2, 3) or 'all'
- Automatic filtering based on student's year

✅ **How It Works**
- Year 1 students see: Year 1 resources + 'all' resources
- Year 2 students see: Year 2 resources + 'all' resources
- Year 3 students see: Year 3 resources + 'all' resources

### 3. Creator Credits
✅ **Added to All Pages**
- Login page
- Signup page
- Resources page footer
- Admin dashboard footer
- Links to your GitHub: https://github.com/Uwami-Mgxekwa

## Setup Instructions

### Step 1: Update Supabase Database

Run the SQL file `supabase-year-content-update.sql` in your Supabase SQL Editor:

1. Go to your Supabase project
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `supabase-year-content-update.sql`
5. Click "Run" to execute

This will:
- Create the `resources` table
- Add year column to schedules table
- Set up RLS policies for year-based filtering
- Insert sample resources

### Step 2: Organize Your PDF Files

Create year-specific folders in your `resources/` directory:

```
resources/
├── year-1/
│   ├── Year-1-Orientation.pdf
│   ├── Year-1-Course-Outline.pdf
│   └── ...
├── year-2/
│   ├── Year-2-Course-Outline.pdf
│   ├── Year-2-Advanced-Topics.pdf
│   └── ...
├── year-3/
│   ├── Year-3-Project-Guidelines.pdf
│   ├── Year-3-Capstone-Info.pdf
│   └── ...
└── all-years/
    ├── Exam-Timetable-2025.pdf
    ├── Application-Form.pdf
    ├── Student-Handbook.pdf
    └── ...
```

### Step 3: Upload Resources via Admin Panel

1. Access admin dashboard: `http://localhost:8000/admin/admin-gcc-portal/index.html`
2. Click "File Manager" in sidebar
3. Click "Upload File" button
4. Fill in:
   - **File Name**: e.g., "Year 1 Orientation Guide"
   - **Category**: Select appropriate category
   - **Year**: Select 1, 2, 3, or 'all'
5. Upload the PDF file
6. Manually place the file in the correct folder

### Step 4: Test the System

1. **Create Test Students**
   - Sign up as a Year 1 student
   - Sign up as a Year 2 student
   - Sign up as a Year 3 student

2. **Verify Year Filtering**
   - Login as Year 1 student → should see Year 1 + 'all' resources
   - Login as Year 2 student → should see Year 2 + 'all' resources
   - Login as Year 3 student → should see Year 3 + 'all' resources

3. **Check Admin Panel**
   - View all students and their years
   - Upload a test file for a specific year
   - Verify it appears only for that year's students

## Database Schema

### Resources Table
```sql
resources (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  category TEXT NOT NULL,
  course TEXT NOT NULL DEFAULT 'Information Technology',
  year TEXT NOT NULL, -- '1', '2', '3', or 'all'
  certificate TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Student Info Table (Updated)
```sql
student_info (
  id UUID PRIMARY KEY,
  student_id TEXT UNIQUE,
  campus TEXT,
  course TEXT, -- Always 'Information Technology'
  faculty TEXT,
  certificate TEXT,
  year TEXT, -- '1', '2', or '3'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Resource Categories

Use these categories when uploading files:

1. **timetables** - Class schedules, exam timetables
2. **forms** - Application forms, request forms
3. **guides** - Study guides, handbooks, tutorials
4. **policies** - College policies, rules, regulations
5. **other** - Miscellaneous documents

## Admin Panel Features

### File Manager
- Upload PDFs with year specification
- View all uploaded files
- Download files
- Delete files
- See file categories and paths

### Student Management
- View all registered students
- See student's year of study
- Search/filter students
- View student details

### Dashboard
- Total students count
- Total files count
- Quick action buttons

## Future Enhancements (Optional)

### 1. Automatic File Upload
Currently, files need to be manually placed in folders. You can enhance this by:
- Integrating Supabase Storage
- Auto-uploading files to cloud
- Generating download links automatically

### 2. Admin Role System
Add proper admin authentication:
- Create `admins` table
- Add `is_admin` column to students
- Restrict admin panel access
- Add admin approval workflow

### 3. Resource Analytics
Track resource usage:
- Download counts
- Most popular resources
- Student engagement metrics

### 4. Notifications
Notify students when new resources are added:
- Email notifications
- In-app notifications
- Push notifications

### 5. Resource Comments
Allow students to:
- Rate resources
- Leave comments
- Report broken links

## Troubleshooting

### Students see wrong year's resources
- Check student's year in database
- Verify RLS policies are active
- Check resource year assignments

### Files not appearing
- Verify file path in database matches actual location
- Check file permissions
- Ensure resources table has correct data

### Upload not working
- Check file size (keep under 10MB)
- Verify PDF format
- Check browser console for errors

## Support

For issues or questions:
- Check the FAQ page in the portal
- Review Supabase logs
- Check browser console for errors
- Contact: support@gautengcitycollege.edu.za

---

**Developed by Uwami Mgxekwa**
GitHub: https://github.com/Uwami-Mgxekwa
