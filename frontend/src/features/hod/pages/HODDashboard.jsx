import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, BarChart3, GraduationCap, Users, Calendar, User } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const HODDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Extract HOD info from authenticated user data (from MongoDB)
  const hodInfo = {
    name: user?.name || 'HOD Name',
    email: user?.email || 'hod@example.com',
    department: user?.department?.name || user?.department || 'Department',
    program: user?.program?.name || user?.program || 'B.Tech',
    branch: user?.branch || 'N/A'
  };

  const stats = [
    { icon: GraduationCap, label: 'Active Batches', value: '4', bgColor: 'bg-sky-50', textColor: 'text-sky-700' },
    { icon: Users, label: 'Total Students', value: '320', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700' },
    { icon: Calendar, label: 'Active Semesters', value: '8', bgColor: 'bg-violet-50', textColor: 'text-violet-700' }
  ];

  const quickActions = [
    {
      title: 'Feedback Management',
      description: 'Manage and publish semester feedback for students',
      icon: FileText,
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      path: '/hod/feedback-management'
    },
    {
      title: 'Feedback Analytics',
      description: 'View detailed analytics and performance reports',
      icon: BarChart3,
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      path: '/hod/feedback-analytics'
    }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-2xl font-medium text-gray-800">HOD Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1.5 leading-snug">Welcome back! Manage feedback and view analytics.</p>
      </motion.div>

      {/* HOD Info Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 lg:w-8 lg:h-8 text-gray-200" />
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">{hodInfo.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{hodInfo.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2.5">
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                {hodInfo.department}
              </span>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-md">
                HOD - {hodInfo.branch}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 lg:mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
            </div>
            <h3 className="text-xs text-gray-500 font-medium mb-0.5">{stat.label}</h3>
            <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(action.path)}
              className={`${action.bgColor} rounded-xl border ${action.borderColor} overflow-hidden text-left hover:shadow-md hover:border-gray-300 transition-all p-5 lg:p-6 group`}
            >
              <div className={`w-10 h-10 lg:w-11 lg:h-11 rounded-lg ${action.iconBg} flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-105 transition-transform`}>
                <action.icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1.5">{action.title}</h3>
              <p className="text-sm text-gray-500 leading-snug">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HODDashboard;
