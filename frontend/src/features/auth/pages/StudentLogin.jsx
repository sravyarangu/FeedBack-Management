import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import PublicNavbar from '../../../shared/components/PublicNavbar';
import { useAuth } from '../../../context/AuthContext';

const StudentLogin = () => {
  const navigate = useNavigate();
  const { studentLogin } = useAuth();
  const [formData, setFormData] = useState({ rollNumber: '', dob: '' });
  const [showDOB, setShowDOB] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await studentLogin(formData.rollNumber, formData.dob);
      
      if (result.success) {
        navigate('/student/dashboard');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <PublicNavbar />
      <div className="flex items-center justify-center p-3 sm:p-4 pt-4 sm:pt-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <GraduationCap className="h-7 w-7 sm:h-9 sm:w-9 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Student Login</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">Access your feedback portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Roll Number</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input type="text" value={formData.rollNumber} onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })} className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase" placeholder="23VV1A0546" required />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input type={showDOB ? 'text' : 'password'} value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full pl-10 sm:pl-11 pr-12 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowDOB(!showDOB)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showDOB ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-blue-600 hover:text-blue-700">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 text-sm sm:text-base">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
    </div>
  );
};

export default StudentLogin;