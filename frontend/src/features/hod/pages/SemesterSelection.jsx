import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Calendar, CheckCircle, Clock, Play } from 'lucide-react';

const SemesterSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { batch, regulation, hodInfo } = location.state || {};

  if (!batch || !regulation) {
    navigate('/hod/feedback-management');
    return null;
  }

  // Calculate which semesters are currently active based on the batch year
  const getCurrentSemesters = (year) => {
    const allSemesters = [
      { id: '1-1', name: 'Semester 1-1', year: 1 },
      { id: '1-2', name: 'Semester 1-2', year: 1 },
      { id: '2-1', name: 'Semester 2-1', year: 2 },
      { id: '2-2', name: 'Semester 2-2', year: 2 },
      { id: '3-1', name: 'Semester 3-1', year: 3 },
      { id: '3-2', name: 'Semester 3-2', year: 3 },
      { id: '4-1', name: 'Semester 4-1', year: 4 },
      { id: '4-2', name: 'Semester 4-2', year: 4 }
    ];

    // Show only current year semesters
    return allSemesters.filter(sem => sem.year === year);
  };

  const availableSemesters = getCurrentSemesters(batch.year);

  // Sample feedback status
  const feedbackStatus = {
    '1-1': 'published',
    '1-2': 'draft',
    '2-1': 'published',
    '2-2': 'draft',
    '3-1': 'published',
    '3-2': 'draft',
    '4-1': 'draft',
    '4-2': 'draft'
  };

  const getStatusConfig = (status) => {
    const configs = {
      published: {
        label: 'Published',
        icon: CheckCircle,
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
      },
      draft: {
        label: 'Draft',
        icon: Clock,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200'
      }
    };
    return configs[status] || configs.draft;
  };

  const handleSemesterClick = (semester) => {
    navigate('/hod/feedback-management/timetable', {
      state: { batch, regulation, semester, hodInfo }
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Select Semester</h1>
        <p className="text-sm text-gray-600 mt-1">Choose semester to manage feedback</p>
      </motion.div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-6 overflow-x-auto">
        <button onClick={() => navigate('/hod/dashboard')} className="hover:text-blue-600 whitespace-nowrap">
          Dashboard
        </button>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <button onClick={() => navigate('/hod/feedback-management')} className="hover:text-blue-600 whitespace-nowrap">
          Feedback Management
        </button>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="whitespace-nowrap">{batch.name}</span>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="whitespace-nowrap">{regulation}</span>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="font-medium text-blue-600 whitespace-nowrap">Semester Selection</span>
      </div>

      {/* Batch & Regulation Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-xs text-gray-600">Batch</p>
            <p className="text-sm font-bold text-gray-900">{batch.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Regulation</p>
            <p className="text-sm font-bold text-gray-900">{regulation}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Current Year</p>
            <p className="text-sm font-bold text-gray-900">Year {batch.year}</p>
          </div>
        </div>
      </motion.div>

      {/* Semesters Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Available Semesters (Year {batch.year})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSemesters.map((semester, index) => {
            const status = feedbackStatus[semester.id];
            const statusConfig = getStatusConfig(status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.button
                key={semester.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSemesterClick(semester)}
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 p-6 text-left transition-all hover:shadow-lg group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 ${statusConfig.bgColor} ${statusConfig.textColor} rounded-full text-xs font-medium border ${statusConfig.borderColor}`}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{semester.name}</h3>
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <Play className="h-4 w-4" />
                  Manage Feedback
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SemesterSelection;
