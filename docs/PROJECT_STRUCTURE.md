# FDM Frontend - Organized Project Structure

## 📁 Current Active Files

### `/src/pages/` - Main Application Pages
- **LandingPage.jsx** - Home page with role selection
- **StudentLogin.jsx** - Student authentication
- **FacultyLogin.jsx** - Faculty authentication
- **HODLogin.jsx** - HOD authentication
- **AdminLogin.jsx** - Admin authentication
- **ForgotPassword.jsx** - Password recovery
- **StudentProfile.jsx** - Student information display
- **MySubmissions.jsx** - Submitted feedback history
- **ChangePassword.jsx** - Password change functionality
- **HelpContact.jsx** - Support and FAQ page
- **SemesterFeedback.jsx** - Feedback form with 20 questions
- **FeedbackPreview.jsx** - Review before submission
- **FeedbackReceipt.jsx** - Submission confirmation

### `/src/components/` - Reusable Components
- **StudentLayout.jsx** - Student dashboard with sidebar navigation
  - Dashboard
  - My Profile
  - My Submissions
  - Change Password
  - Help & Contact
  - Logout

### `/src/starting_files/` - Archived/Unused Components
- **student/RatingInput.jsx** - Old rating component
- **student/SubjectCard.jsx** - Old subject card component

## 🛣️ Application Routes

### Public Routes
- `/` - Landing Page
- `/login/student` - Student Login
- `/login/hod` - HOD Login
- `/login/admin` - Admin Login
- `/forgot-password` - Password Reset

### Student Routes (With Sidebar)
- `/student/dashboard` - Dashboard Home
- `/student/profile` - My Profile
- `/student/submissions` - My Submissions
- `/student/change-password` - Change Password
- `/student/help` - Help & Contact

### Student Routes (Without Sidebar)
- `/student/semester/:semesterId` - Feedback Form
- `/student/semester/:semesterId/preview` - Preview Feedback
- `/student/semester/:semesterId/receipt` - View Receipt

## ✨ Key Features

### Student Dashboard
- Student information card (Name, Email, Roll No, Branch, Semester)
- Statistics: Current Semester, Submissions, Completion Rate, Pending
- Feedback sessions with status (Closed/Submitted/Active)
- Collapsible sidebar navigation

### Feedback System
- 20 comprehensive questions per subject
- 2 tables side-by-side layout
- 10 rows per table, 2 tables per page
- 5 pages total (100 responses)
- Preview all responses in single table
- Validation: Can only submit when all fields complete

### Security & Validation
- Forgot password functionality
- Password requirements enforcement
- Submission confirmation dialog
- Cannot submit incomplete feedback

## 🎨 Design System
- **Colors**: fdm-blue theme (50-900 shades)
- **Icons**: lucide-react
- **Animations**: framer-motion
- **Styling**: Tailwind CSS v4
- **Layout**: Gradient backgrounds, glass effects, shadow cards

## 📝 Notes
- Old/unused components moved to `starting_files/`
- Clean routing structure with nested routes
- Responsive design with mobile support
- Professional UI matching reference design
