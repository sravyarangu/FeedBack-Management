import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Calendar, BarChart3, TrendingUp } from 'lucide-react';

const AnalyticsSemesterSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { batch, regulation, hodInfo } = location.state || {};

  if (!batch || !regulation) {
    navigate('/hod/feedback-analytics');
    return null;
  }

  const getCurrentSemesters = (year) => {
    const allSemesters = [
      { id: '1-1', name: 'Semester 1-1', year: 1, responses: 45, avgRating: 4.2 },
      { id: '1-2', name: 'Semester 1-2', year: 1, responses: 42, avgRating: 4.3 },
      { id: '2-1', name: 'Semester 2-1', year: 2, responses: 48, avgRating: 4.1 },
      { id: '2-2', name: 'Semester 2-2', year: 2, responses: 47, avgRating: 4.4 },
      { id: '3-1', name: 'Semester 3-1', year: 3, responses: 50, avgRating: 4.5 },
      { id: '3-2', name: 'Semester 3-2', year: 3, responses: 49, avgRating: 4.3 },
      { id: '4-1', name: 'Semester 4-1', year: 4, responses: 44, avgRating: 4.2 },
      { id: '4-2', name: 'Semester 4-2', year: 4, responses: 46, avgRating: 4.4 }
    ];

    return allSemesters.filter(sem => sem.year === year);
  };

  const availableSemesters = getCurrentSemesters(batch.year);

  const handleSemesterClick = (semester) => {
    navigate('/hod/feedback-analytics/report', {
      state: { batch, regulation, semester, hodInfo }
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-100';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Select Semester for Analytics</h1>
        <p className="text-sm text-gray-600 mt-1">Choose semester to view detailed analytics</p>
      </motion.div>

      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-6 overflow-x-auto">
        <button onClick={() => navigate('/hod/dashboard')} className="hover:text-blue-600 whitespace-nowrap">
          Dashboard
        </button>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <button onClick={() => navigate('/hod/feedback-analytics')} className="hover:text-blue-600 whitespace-nowrap">
          Feedback Analytics
        </button>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="whitespace-nowrap">{batch.name}</span>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="whitespace-nowrap">{regulation}</span>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="font-medium text-blue-600 whitespace-nowrap">Semester Selection</span>
      </div>

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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Available Semesters (Year {batch.year})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSemesters.map((semester, index) => (
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
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${getRatingColor(semester.avgRating)}`}>
                  {semester.avgRating}/5
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{semester.name}</h3>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-600">Responses</p>
                  <p className="font-bold text-gray-900">{semester.responses}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg Rating</p>
                  <p className="font-bold text-gray-900">{semester.avgRating}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mt-4">
                <TrendingUp className="h-4 w-4" />
                View Analytics
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsSemesterSelection;
