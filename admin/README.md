# GCC Admin Portal

## Overview
The GCC Admin Portal is a comprehensive administrative interface designed to efficiently manage the student portal system at GCC. This centralized platform provides administrators with powerful tools to handle student accounts, academic resources, course management, and institutional communications.

## Features

### User Management
- Create, edit, and deactivate student accounts
- Manage administrative access levels and permissions
- Bulk import student data from CSV/Excel files
- Reset passwords and manage account recovery
- Monitor login activity and security logs

### Course Administration
- Create and manage course catalogs
- Schedule classes and assign instructors
- Control enrollment periods and registration limits
- Track waitlists and manage course prerequisites
- Generate class rosters and attendance reports

### Grade Management
- Input and modify grades for individual students or classes
- Calculate GPAs and academic standings
- Generate grade reports and transcripts
- Track academic probation and honors status
- Set up and manage grading scales

### Communication Center
- Send targeted announcements to specific student groups
- Schedule automated notifications for deadlines and events
- Manage email templates and notification preferences
- Track message delivery and open rates
- Create and distribute surveys and feedback forms

### Document Repository
- Upload and organize academic resources
- Manage forms and policy documents
- Control document access permissions
- Track document version history
- Generate printable documents and reports

### Analytics Dashboard
- Monitor student portal usage in real-time
- Track key performance indicators for student success
- Generate custom reports on various metrics
- Export data for external analysis
- Visualize trends and patterns in student activity

## Technical Requirements

### System Requirements
- **Server**: Linux/Windows Server with minimum 8GB RAM, 4 cores
- **Storage**: Minimum 100GB SSD storage
- **Web Server**: Nginx or Apache with PHP 8.0+

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Security Features
- Role-based access control (RBAC)
- Two-factor authentication (2FA)
- Data encryption at rest and in transit
- Comprehensive audit logging
- GDPR and FERPA compliance measures

## Installation

### Quick Start
1. Clone the repository:
   ```
   git clone https://github.com/gcc/admin-portal.git
   ```
2. Navigate to the project directory:
   ```
   cd admin-portal
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Configure your environment variables:
   ```
   cp .env.example .env
   ```
5. Run the setup script:
   ```
   npm run setup
   ```
6. Start the development server:
   ```
   npm run dev
   ```

### Configuration
The system can be configured through the `.env` file or through the web interface once installed. Key configuration options include:

- Database connection settings
- SMTP server settings for email notifications
- Authentication provider settings
- File storage locations
- Logging preferences

## API Documentation
The GCC Admin Portal includes a comprehensive API for integration with other systems. Full documentation is available at `/api/docs` once the system is running.

## Troubleshooting

### Common Issues
- **Database Connection Errors**: Verify database credentials and network access
- **Email Sending Failures**: Check SMTP configuration and server status
- **File Upload Issues**: Verify file permissions on storage directories
- **Performance Problems**: Check server resources and database query performance

### Support
For technical support, please contact:
- Email: support@gcc-portal.edu

## Creators & Contributors
- **Uwami Mgxekwa** - [GitHub Profile](https://github.com/Uwami-Mgxekwa)
- **Handome Nyathi** - [GitHub Profile](https://github.com/MisterH100)
