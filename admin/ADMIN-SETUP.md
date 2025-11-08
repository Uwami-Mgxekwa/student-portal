# Admin Dashboard Setup Guide

## Overview
The simplified admin dashboard allows you to:
- View total students and their details
- Upload and manage PDF files for the resources section
- See basic statistics

## Setup Instructions

### 1. Update Supabase Credentials

Open `admin/admin-gcc-portal/js/admin-script.js` and update lines 2-3 with your Supabase credentials:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

You can find these in your Supabase project settings.

### 2. Access the Admin Dashboard

1. Start your local server (e.g., `python -m http.server 8000`)
2. Navigate to: `http://localhost:8000/admin/admin-gcc-portal/index.html`
3. You'll be redirected to login if not authenticated

### 3. Features

#### Dashboard Page
- Shows total students count
- Shows total files count
- Quick action buttons

#### Students Page
- View all registered students
- Search students by ID, name, or course
- See student details including:
  - Student ID
  - Name and Surname
  - Course
  - Email (generated)
  - Join date

#### File Manager Page
- View all uploaded PDF files
- Upload new PDF files with:
  - Custom file name
  - Category selection (Timetables, Forms, Guides, Policies, Other)
  - Drag & drop support
- Download files
- Delete files

### 4. File Upload Process

When you upload a file through the admin panel:

1. Fill in the file name (without .pdf extension)
2. Select a category
3. Choose or drag & drop your PDF file
4. Click "Upload File"
5. **Important**: Manually place the uploaded PDF in the `resources/` folder with the correct name
6. The file will appear in the resources page for students

### 5. Removed Features (Simplified)

We removed these unnecessary features:
- Analytics dashboard
- Pending approvals
- System alerts
- Recently active users widget
- Quick notes widget
- Calendar widget
- Recent activity feed
- Stat trends/percentages
- Course management
- Schedule management
- Event management
- Settings page

### 6. Security Note

Currently, there's no admin role check. To add admin authentication:

1. Add an `is_admin` column to your `student_info` table
2. Update the `checkAuth()` function in `admin-script.js` to verify admin status
3. Redirect non-admin users to the student portal

## File Structure

```
admin/
├── admin-gcc-portal/
│   ├── index.html          # Main admin dashboard
│   ├── css/
│   │   └── admin-style.css # Simplified styles
│   ├── js/
│   │   └── admin-script.js # Admin functionality with Supabase
│   └── config/
│       └── supabase-config.js # Supabase credentials
└── ADMIN-SETUP.md          # This file
```

## Troubleshooting

### Students not loading
- Check Supabase credentials
- Verify `student_info` table exists
- Check browser console for errors

### File upload not working
- Ensure you're using PDF files only
- Check file size (keep under 10MB for best performance)
- Remember to manually place files in `resources/` folder

### Can't access admin dashboard
- Make sure you're logged in to the student portal first
- Check that Supabase session is active
- Clear browser cache and try again
