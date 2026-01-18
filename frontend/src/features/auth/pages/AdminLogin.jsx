import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowLeft, Shield, UserCog, Crown } from 'lucide-react';
import PublicNavbar from '../../../shared/components/PublicNavbar';
import { useAuth } from '../../../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin, principalLogin, vicePrincipalLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Role options
  const roles = [
    { id: 'principal', name: 'Principal', icon: Crown, color: 'from-amber-500 to-orange-600', description: 'Full analytics access' },
    { id: 'vice-principal', name: 'Vice Principal', icon: Shield, color: 'from-teal-500 to-cyan-600', description: 'Analytics access' },
    { id: 'super-admin', name: 'Super Admin', icon: UserCog, color: 'from-purple-500 to-indigo-600', description: 'Full system control' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      let result;
      
      // Call the appropriate login function based on selected role
      if (selectedRole === 'principal') {
        result = await principalLogin(formData.email, formData.password);
      } else if (selectedRole === 'vice-principal') {
        result = await vicePrincipalLogin(formData.email, formData.password);
      } else if (selectedRole === 'super-admin') {
        result = await adminLogin(formData.email, formData.password);
      }
      
      if (result.success) {
        // Navigate based on role
        if (selectedRole === 'principal' || selectedRole === 'vice-principal') {
          navigate('/admin/analytics');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    if (selectedRole === 'principal') return Crown;
    if (selectedRole === 'vice-principal') return Shield;
    if (selectedRole === 'super-admin') return UserCog;
    return Building2;
  };

  const getRoleColor = () => {
    const role = roles.find(r => r.id === selectedRole);
    return role?.color || 'from-orange-500 to-orange-600';
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <PublicNavbar />
      <div className="flex items-center justify-center p-3 sm:p-4 pt-4 sm:pt-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <motion.div 
              key={selectedRole}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${getRoleColor()} rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}
            >
              <RoleIcon className="h-7 w-7 sm:h-9 sm:w-9 text-white" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold">Administrator Login</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">System management access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedRole === role.id
                        ? `border-orange-500 bg-orange-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <role.icon className={`h-5 w-5 mx-auto mb-1 ${selectedRole === role.id ? 'text-orange-600' : 'text-gray-400'}`} />
                    <p className={`text-xs font-medium ${selectedRole === role.id ? 'text-orange-700' : 'text-gray-600'}`}>
                      {role.id === 'super-admin' ? 'Super Admin' : role.name}
                    </p>
                  </button>
                ))}
              </div>
              {selectedRole && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {roles.find(r => r.id === selectedRole)?.description}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="admin@university.edu" required />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-10 sm:pl-11 pr-12 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-orange-600 hover:text-orange-700">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 text-sm sm:text-base">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
    </div>
  );
};

export default AdminLogin;