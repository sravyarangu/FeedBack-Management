import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, User, UserCheck, Building2, ArrowRight,
  CheckCircle, ShieldCheck, Lock, EyeOff, Target
} from 'lucide-react';
import PublicNavbar from '../../../shared/components/PublicNavbar';

const LandingPage = () => {
  const navigate = useNavigate();

  const userRoles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Provide valuable feedback to improve your learning experience',
      icon: GraduationCap,
      gradient: 'from-blue-500 to-blue-600',
      features: ['Submit Feedback', 'View Submissions', 'Track Progress']
    },
    // {
    //   id: 'faculty',
    //   title: 'Faculty',
    //   description: 'View and analyze student feedback to enhance teaching quality',
    //   icon: User,
    //   gradient: 'from-purple-500 to-purple-600',
    //   features: ['View Feedback', 'Analytics', 'Reports']
    // },
    {
      id: 'hod',
      title: 'HOD',
      description: 'Monitor department performance and manage faculty evaluations',
      icon: UserCheck,
      gradient: 'from-emerald-500 to-emerald-600',
      features: ['Department Analytics', 'Faculty Reports', 'Approvals']
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Manage the entire feedback system and generate institutional reports',
      icon: Building2,
      gradient: 'from-orange-500 to-orange-600',
      features: ['System Management', 'All Reports', 'User Control']
    }
  ];

  const privacyFeatures = [
    { 
      icon: EyeOff, 
      title: '100% Anonymous', 
      description: 'No faculty member or authority can see who submitted which feedback.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      icon: ShieldCheck, 
      title: 'Identity Protected', 
      description: 'Feel free to be honest—your identity is always protected.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      icon: Lock, 
      title: 'Strictly Confidential', 
      description: 'All feedback is collected anonymously and is strictly confidential.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      icon: Target, 
      title: 'Your Voice Matters', 
      description: 'Your feedback directly influences future faculty assignments.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PublicNavbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 lg:mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4">
            Feedback<span className="block text-gradient mt-2 pb-6 lg:pb-4">Management Portal</span>
          </h2>
          <p className="text-base lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Empowering educational excellence through comprehensive feedback
          </p>
          
          {/* Privacy & Anonymity Section */}
          <div className="mt-10 lg:mt-8 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-lime-400 rounded-2xl lg:rounded-3xl p-[2px]"
            >
              <div className="bg-white rounded-2xl lg:rounded-3xl p-5 lg:p-8">
                <div className="flex items-center justify-center gap-2 lg:gap-3 mb-5 lg:mb-8">
                  <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Your Privacy is Our Priority</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {privacyFeatures.map((feature, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className={`${feature.bgColor} rounded-lg sm:rounded-xl p-3 sm:p-4 text-left hover:shadow-md transition-shadow`}
                    >
                      <feature.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${feature.color} mb-2 sm:mb-3`} />
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{feature.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="mb-10 lg:mb-20">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 lg:mb-10">Select Your Role</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
            {userRoles.map((role, i) => (
              <motion.div key={role.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }} onClick={() => navigate(`/login/${role.id}`)} className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-5 lg:p-8 cursor-pointer hover:shadow-2xl transition-all group">
                <div className={`w-14 h-14 lg:w-18 lg:h-18 rounded-xl lg:rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <role.icon className="h-7 w-7 lg:h-9 lg:w-9 text-white" />
                </div>
                <h4 className="text-lg lg:text-xl font-bold mb-2 lg:mb-3">{role.title}</h4>
                <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-5">{role.description}</p>
                <div className="space-y-2 mb-5 lg:mb-6">
                  {role.features.map((f, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <button className={`w-full bg-gradient-to-r ${role.gradient} text-white font-semibold py-3 lg:py-3.5 px-4 rounded-xl text-sm lg:text-base flex items-center justify-center group-hover:gap-2 hover:shadow-lg transition-all`}>
                  Login as {role.title}
                  <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white mt-16 lg:mt-24 py-8 lg:py-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm lg:text-base text-gray-600">
          <p>© 2025 Faculty Feedback Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
