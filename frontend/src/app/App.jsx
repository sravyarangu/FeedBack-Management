import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../styles/App.css';

// Context
import { AuthProvider } from '../context/AuthContext';

// Auth Pages
import LandingPage from '../features/auth/pages/LandingPage';
import StudentLogin from '../features/auth/pages/StudentLogin';
import HODLogin from '../features/auth/pages/HODLogin';
import AdminLogin from '../features/auth/pages/AdminLogin';
import ForgotPassword from '../features/auth/pages/ForgotPassword';

// Student Feature
import { StudentLayout, StudentDashboardHome } from '../features/student/layouts/StudentLayout';
import StudentProfile from '../features/student/pages/StudentProfile';
import MySubmissions from '../features/student/pages/MySubmissions';
import ChangePassword from '../features/student/pages/ChangePassword';
import HelpContact from '../features/student/pages/HelpContact';
import SemesterFeedback from '../features/student/pages/SemesterFeedback';
import FeedbackPreview from '../features/student/pages/FeedbackPreview';
import FeedbackReceipt from '../features/student/pages/FeedbackReceipt';

// HOD Feature
import HODLayout from '../features/hod/layouts/HODLayout';
import HODDashboard from '../features/hod/pages/HODDashboard';
import FeedbackManagement from '../features/hod/pages/FeedbackManagement';
import SemesterSelection from '../features/hod/pages/SemesterSelection';
import TimetableView from '../features/hod/pages/TimetableView';
import FeedbackAnalytics from '../features/hod/pages/FeedbackAnalytics';
import AnalyticsSemesterSelection from '../features/hod/pages/AnalyticsSemesterSelection';
import AnalyticsReport from '../features/hod/pages/AnalyticsReport';
import HODChangePassword from '../features/hod/pages/HODChangePassword';

// Admin Feature
import AdminPage from '../features/admin/pages/Admin';
import AdminLayout from '../features/admin/layouts/AdminLayout';
import PrincipalAnalytics from '../features/admin/pages/PrincipalAnalytics';
import PrincipalAnalyticsReport from '../features/admin/pages/PrincipalAnalyticsReport';
import AdminChangePassword from '../features/admin/pages/AdminChangePassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Login Routes */}
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/login/hod" element={<HODLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Student Routes with Sidebar Layout */}
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboardHome />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="submissions" element={<MySubmissions />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="help" element={<HelpContact />} />
            <Route path="semester/:semesterId" element={<SemesterFeedback />} />
            <Route path="semester/:semesterId/preview" element={<FeedbackPreview />} />
            <Route path="semester/:semesterId/receipt" element={<FeedbackReceipt />} />
          </Route>
          
          {/* Faculty Routes */}
          <Route path="/faculty/dashboard" element={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white"><div className="text-center"><h1 className="text-2xl font-bold">Faculty Dashboard</h1><p className="text-sm text-gray-600 mt-2">Coming Soon...</p></div></div>} />
          
          {/* HOD Routes with Sidebar Layout */}
          <Route path="/hod" element={<HODLayout />}>
            <Route path="dashboard" element={<HODDashboard />} />
            <Route path="feedback-management" element={<FeedbackManagement />} />
            <Route path="feedback-management/semesters" element={<SemesterSelection />} />
            <Route path="feedback-management/timetable" element={<TimetableView />} />
            <Route path="feedback-analytics" element={<FeedbackAnalytics />} />
            <Route path="feedback-analytics/semesters" element={<AnalyticsSemesterSelection />} />
            <Route path="feedback-analytics/report" element={<AnalyticsReport />} />
            <Route path="change-password" element={<HODChangePassword />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminPage />} />
            <Route path="analytics" element={<PrincipalAnalytics />} />
            <Route path="analytics/report" element={<PrincipalAnalyticsReport />} />
            <Route path="change-password" element={<AdminChangePassword />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
