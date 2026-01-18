
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, User, FileText, Lock, HelpCircle, LogOut, 
  ChevronLeft, ChevronRight, Calendar, BookOpen, Award, CheckCircle 
} from 'lucide-react';
import jntugvLogo from '../../../assets/jntugv_logo.jpg';
import { useAuth } from '../../../context/AuthContext';

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { id: 'profile', label: 'My Profile', icon: User, path: '/student/profile' },
    { id: 'submissions', label: 'My Submissions', icon: FileText, path: '/student/submissions' },
    { id: 'password', label: 'Change Password', icon: Lock, path: '/student/change-password' },
    { id: 'help', label: 'Help & Contact', icon: HelpCircle, path: '/student/help' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout(); // Call AuthContext logout
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-amber-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to logout? You will need to login again to access your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white flex flex-col fixed h-screen z-50 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-60'
        } ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <img src={jntugvLogo} alt="JNTUGV Logo" className="w-8 h-8 rounded-lg object-contain bg-white border border-gray-200" />
              <div>
                <h2 className="text-xs font-bold">JNTUGV Feedback Portal</h2>
                <p className="text-xs text-gray-400">Student Portal</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                isActive(item.path)
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-800 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 w-full min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`}>
        <Outlet />
      </main>
    </div>
  );
};

const StudentDashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get student data from authenticated user
  const studentInfo = {
    name: user?.name || 'Student Name',
    email: user?.email || 'student@example.com',
    rollNumber: user?.rollNo || 'N/A',
    branch: user?.program || 'N/A',
    department: user?.branch || 'N/A',
    semester: `Sem ${user?.semester || 'N/A'}`,
    batch: user?.admittedYear ? `${user.admittedYear}-${parseInt(user.admittedYear) + 4}` : 'N/A'
  };

  const feedbackSessions = [
    { 
      id: 1, 
      semester: 'Semester 3-1', 
      status: 'active', 
      dateRange: 'Nov 1 - Dec 16, 2024',
      submittedDate: null 
    },
    { 
      id: 2, 
      semester: 'Semester 2-2', 
      status: 'submitted', 
      dateRange: 'Apr 1 - May 16, 2024',
      submittedDate: 'May 10, 2024 at 8:00 PM' 
    },
    { 
      id: 3, 
      semester: 'Semester 2-1', 
      status: 'submitted', 
      dateRange: 'Nov 1 - Dec 16, 2023',
      submittedDate: 'Dec 1, 2023 at 3:45 PM' 
    }
  ];

  const stats = [
    { icon: Calendar, label: 'Current Semester', value: 'Semester 3-1', bgColor: 'bg-sky-50', textColor: 'text-sky-600' },
    { icon: CheckCircle, label: 'Submissions', value: '2/3', bgColor: 'bg-teal-50', textColor: 'text-teal-600' },
    { icon: Award, label: 'Completion Rate', value: '66%', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600' },
    { icon: BookOpen, label: 'Pending', value: '1 Session', bgColor: 'bg-amber-50', textColor: 'text-amber-600' }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      closed: { label: 'Closed', className: 'bg-gray-100 text-gray-600' },
      submitted: { label: 'Submitted', className: 'bg-teal-50 text-teal-600' },
      active: { label: 'Active', className: 'bg-indigo-50 text-indigo-600' }
    };
    return badges[status] || badges.closed;
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <h1 className="text-xl lg:text-2xl font-medium text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1.5 leading-snug">Welcome back! View your feedback sessions below.</p>
      </motion.div>

      {/* Student Info Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 lg:w-8 lg:h-8 text-gray-200" />
          </div>
          <div className="flex-1">
            <h2 className="text-base lg:text-lg font-semibold text-gray-800">{studentInfo.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{studentInfo.email}</p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 bg-teal-50 text-teal-600 text-xs font-medium rounded-md">
                {studentInfo.rollNumber}
              </span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                {studentInfo.branch}
              </span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-md">
                {studentInfo.semester}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0 hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{studentInfo.department}</p>
            <p className="text-xs text-gray-500 mt-0.5">Batch: {studentInfo.batch}</p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid - Icons Centered */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mx-auto mb-2.5`}>
              <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
            </div>
            <h3 className="text-xs text-gray-500 font-medium mb-0.5">{stat.label}</h3>
            <p className="text-lg font-semibold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Feedback Sessions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 className="text-base lg:text-lg font-semibold text-gray-800 mb-4 text-center">Feedback Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbackSessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            >
              <div className="p-4 lg:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-800">{session.semester}</h3>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusBadge(session.status).className}`}>
                    {getStatusBadge(session.status).label}
                  </span>
                </div>
                <div className="space-y-1.5 mb-4">
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {session.dateRange}
                  </p>
                  {session.submittedDate && (
                    <p className="text-xs text-teal-600 font-medium">
                      Submitted on {session.submittedDate}
                    </p>
                  )}
                </div>
                {session.status === 'active' && (
                  <button
                    onClick={() => navigate(`/student/semester/${session.id}`)}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Start Feedback →
                  </button>
                )}
                {session.status === 'submitted' && (
                  <p className="w-full py-2.5 px-4 bg-teal-50 text-teal-600 text-xs font-medium rounded-lg text-center border border-teal-100">
                    ✓ Feedback form already submitted
                  </p>
                )}
                {session.status === 'closed' && !session.submittedDate && (
                  <p className="w-full py-2.5 px-4 bg-gray-50 text-gray-500 text-xs font-medium rounded-lg text-center">
                    Feedback form expired
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export { StudentLayout, StudentDashboardHome };