
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import jntugvLogo from '../../assets/jntugv_logo.jpg';

const PublicNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loginOptions = [
    { path: '/login/student', label: 'Student Login', color: 'blue' },
    { path: '/login/hod', label: 'HOD Login', color: 'emerald' },
    { path: '/login/admin', label: 'Admin Login', color: 'orange' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
            <div className="flex items-center flex-1 min-w-0">
              <button 
                onClick={() => navigate('/')} 
                className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
              >
                <img src={jntugvLogo} alt="JNTUGV Logo" className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg object-contain bg-white border border-gray-200" />
              </button>
              <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                <h2 className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm font-bold text-violet-900 leading-tight">
                  JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY GURAJADA VIZIANAGARAM
                </h2>
              </div>
            </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </button>
            
            {loginOptions.map((option) => (
              <button
                key={option.path}
                onClick={() => navigate(option.path)}
                className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(option.path)
                    ? `bg-${option.color}-100 text-${option.color}-700`
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </button>
            
            {loginOptions.map((option) => (
              <button
                key={option.path}
                onClick={() => {
                  navigate(option.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(option.path)
                    ? `bg-${option.color}-100 text-${option.color}-700`
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LogIn className="h-4 w-4" />
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default PublicNavbar;
