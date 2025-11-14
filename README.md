# Gauteng City College Student Portal

A modern student portal for managing academic information, schedules, courses, and resources at Gauteng City College.

![GCC Logo](./assets/logo.png)

## ✨ Features

- **Authentication** - Secure login/signup with Supabase Auth
- **Dashboard** - Overview of courses, assignments, and calendar
- **Schedules** - Personalized timetables with PDF download
- **Courses** - Track progress, view assignments and test marks
- **Resources** - Access forms, guides, and exam timetables
- **Finances** - View payment history and outstanding fees
- **Events** - Campus events with calendar export (.ics)
- **Settings** - Update profile, change password, upload profile picture
- **Dark Mode** - Toggle between light and dark themes
- **Mobile Responsive** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Font Awesome
- **PDF Generation**: html2pdf.js

## 🚀 Quick Start

1. **Clone the repo**
   ```bash
   git clone https://github.com/Uwami-Mgxekwa/student-portal.git
   cd student-portal
   ```

2. **Set up Supabase**
   - Create project at [supabase.com](https://supabase.com)
   - Run database schema from `databaseScripts/` folder
   - Update `config/supabase.js` with your credentials

3. **Run locally**
   ```bash
   # Python
   python -m http.server 8000
   
   # Or use VS Code Live Server extension
   # Or double-click start-server.bat (Windows)
   ```

4. **Open** `http://localhost:8000`

## 📖 Usage

**Students**: Sign up → Login with Student ID → Access dashboard, schedules, courses, and resources

**Admin**: Separate admin portal in `admin-gcc-portal/` folder for managing students, files, and data

## 📁 Project Structure

```
student-portal/
├── admin-gcc-portal/    # Admin dashboard
├── assets/              # Images and media
├── config/              # Supabase configuration
├── css/                 # Stylesheets
├── databaseScripts/     # SQL schemas
├── js/                  # JavaScript files
├── lib/                 # Utility functions
├── pages/               # HTML pages
├── resources/           # Downloadable PDFs
└── index.html           # Landing page
```

## 🗄️ Database Tables

- `students` - Student accounts and personal info
- `student_info` - Academic information (course, year, faculty)
- `schedules` - Course timetables (JSONB)
- `resources` - Downloadable files metadata
- `support_tickets` - Student support requests

## 🎨 Customization

- **Logo**: Replace `assets/logo.png`
- **Colors**: Edit `css/color-scheme.css`
- **Courses**: Update signup form and `lib/supabase-auth.js`

## 📝 License

Open source for educational purposes.

## 👤 Author

**Uwami Mgxekwa**
- GitHub: [@Uwami-Mgxekwa](https://github.com/Uwami-Mgxekwa)

---

**Built for Gauteng City College students** 🎓
