# Gauteng City College Student Portal

A modern, full-featured student portal web application designed to streamline student access to academic information, resources, and services at Gauteng City College.

![GCC Logo](./assets/logo.png)

## 🎓 Overview

The Gauteng City College Student Portal provides a centralized platform for students to manage their academic journey. It offers an intuitive interface to access schedules, course materials, resources, and support services - all in one place.

## ✨ Features

### 🔐 Authentication & User Management
- **Student Registration** - Self-service signup with course selection
- **Secure Login** - Student ID and password authentication
- **Profile Management** - View and manage personal information
- **Session Management** - Automatic session handling with Supabase Auth

### 📅 Schedule Management
- **Personalized Timetables** - Automatic schedule generation based on course enrollment
- **Weekly View** - Clear Monday-Friday timetable display
- **PDF Download** - Download timetable as PDF for offline access
- **Print Functionality** - Print-friendly schedule format

### 📚 Course & Academic Features
- **Course Dashboard** - View enrolled, recommended, and completed courses
- **Course Progress** - Track progress with visual indicators
- **Academic Information** - Access course details, faculty, and certificate information
- **Events Calendar** - Stay updated on campus events and deadlines

### 📄 Resources Center
- **Document Library** - Access examination timetables, forms, and policies
- **PDF Downloads** - Download academic forms and documents
- **Categorized Resources** - Organized by type (Exams, Forms, Guides, Policies)
- **Search & Filter** - Quickly find needed resources

### 💬 Support & Help
- **FAQ System** - Comprehensive frequently asked questions
- **Support Tickets** - Submit support requests through contact form
- **Searchable Help** - Find answers quickly with search functionality
- **Category Filters** - Browse help by topic (Login, Registration, Technical, etc.)

### 🎨 User Experience
- **Dark/Light Theme** - Toggle between themes for comfortable viewing
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI** - Clean, intuitive interface with smooth animations
- **Accessibility** - Designed with accessibility best practices

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables for theming
- **JavaScript (ES6+)** - Modular, modern JavaScript
- **Font Awesome** - Icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time capabilities
- **Supabase Storage** - File storage (future implementation)

### Libraries & Tools
- **html2pdf.js** - PDF generation for timetables
- **Supabase JS Client** - Database and auth integration

### Development Tools
- **Visual Studio Code** - Code editor
- **Git** - Version control
- **Figma** - UI/UX design

## 📦 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (Python, Node.js, or VS Code Live Server)
- Supabase account (for backend)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Uwami-Mgxekwa/student-portal.git
   cd student-portal
   ```

2. **Set up Supabase**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase-setup.sql` in Supabase SQL Editor
   - Run sample data from `sample-data.sql` (optional)
   - Update `config/supabase.js` with your Supabase URL and anon key

3. **Configure Authentication**
   - Go to Supabase → Authentication → Providers
   - Enable Email provider
   - Disable email confirmations (for testing)

4. **Start Local Server**
   
   **Option 1: Python**
   ```bash
   python -m http.server 8000
   ```
   
   **Option 2: Node.js**
   ```bash
   npx http-server -p 8080
   ```
   
   **Option 3: VS Code Live Server**
   - Install Live Server extension
   - Right-click `index.html` → Open with Live Server
   
   **Option 4: Batch File (Windows)**
   ```bash
   start-server.bat
   ```

5. **Access the Portal**
   - Open browser to `http://localhost:8000`
   - Sign up with a test account
   - Explore the features!

## 🚀 Usage

### For Students

1. **Sign Up**
   - Click "Sign Up" on the home page
   - Fill in personal details
   - Select your course, certificate type, and year
   - Create account

2. **Login**
   - Use your Student ID and password
   - Access your personalized dashboard

3. **View Schedule**
   - Navigate to Schedule page
   - View your weekly timetable
   - Download as PDF or print

4. **Access Resources**
   - Browse available documents
   - Download forms and timetables
   - Search for specific resources

5. **Get Support**
   - Visit FAQ page for common questions
   - Submit support ticket if needed
   - Search for help topics

### For Administrators

**Current Setup (Manual):**
- Manage schedules via Supabase dashboard
- Add/update timetables in `schedules` table
- View support tickets in `support_tickets` table

**Future Admin Panel:**
- Web-based admin interface (planned)
- Manage students, courses, and schedules
- Respond to support tickets
- Generate reports

## 📁 Project Structure

```
student-portal/
├── assets/              # Images, videos, and media files
├── config/              # Configuration files
│   └── supabase.js      # Supabase configuration
├── css/                 # Stylesheets
│   ├── global-styles.css
│   ├── color-scheme.css
│   └── [page]-styles.css
├── js/                  # JavaScript files
│   ├── index-script.js
│   ├── login-script.js
│   ├── dashboard-script.js
│   └── [page]-script.js
├── lib/                 # Utility libraries
│   ├── supabase-auth.js # Authentication functions
│   ├── loading.js       # Loading spinner
│   ├── pop-up.js        # Alerts and modals
│   ├── theme.js         # Theme switching
│   └── validate-form.js # Form validation
├── pages/               # HTML pages
│   ├── login.html
│   ├── sign-up.html
│   ├── dashboard.html
│   ├── schedule.html
│   ├── courses.html
│   ├── resources.html
│   ├── faq.html
│   └── [other].html
├── resources/           # Downloadable PDF documents
├── index.html           # Landing page
├── supabase-setup.sql   # Database schema
├── sample-data.sql      # Sample data and test accounts
└── README.md            # This file
```

## 🗄️ Database Schema

### Tables

**students**
- Student account information
- Links to Supabase Auth users

**student_info**
- Academic information (course, faculty, certificate, year)
- Links to students via student_id

**schedules**
- Course timetables stored as JSONB
- Organized by course and certificate type

**support_tickets**
- Student support requests
- Tracks status and issue types

## 🎨 Customization

### Branding
- Update logo in `assets/logo.png`
- Modify colors in `css/color-scheme.css`
- Update college name in HTML files

### Courses
- Add courses in signup form (`pages/sign-up.html`)
- Update faculty mapping in `lib/supabase-auth.js`
- Add schedules in Supabase `schedules` table

### Resources
- Add PDF files to `resources/` folder
- Update links in `pages/resources.html`
- Follow naming convention: `lowercase-with-hyphens.pdf`

## 🔒 Security Features

- Row Level Security (RLS) on database tables
- Secure authentication with Supabase Auth
- Session management with JWT tokens
- Input validation and sanitization
- HTTPS recommended for production

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Design

- Desktop: Full-featured experience
- Tablet: Optimized layout with collapsible sidebar
- Mobile: Touch-friendly interface with hamburger menu

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available for educational purposes.

## 👥 Authors

**Uwami Mgxekwa**
- GitHub: [@Uwami-Mgxekwa](https://github.com/Uwami-Mgxekwa)

**Handsome Nyathi**
- GitHub: [@MisterH100](https://github.com/MisterH100)

## 🙏 Acknowledgments

- Gauteng City College for the opportunity
- Supabase for the excellent backend platform
- Font Awesome for icons
- html2pdf.js for PDF generation

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Use the FAQ/Support page in the portal
- Contact the development team

---

**Built with ❤️ for Gauteng City College students**
