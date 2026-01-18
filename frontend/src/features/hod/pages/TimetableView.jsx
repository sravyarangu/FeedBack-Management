import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, BookOpen, User, Clock, CheckCircle, Send } from 'lucide-react';

const TimetableView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { batch, regulation, semester, hodInfo } = location.state || {};
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  if (!batch || !regulation || !semester) {
    navigate('/hod/feedback-management');
    return null;
  }

  // Static timetable - mapped by admin
  const timetable = [
    {
      id: 1,
      subjectCode: 'CS601',
      subjectName: 'Data Structures',
      subjectType: 'Theory',
      faculty: 'Dr. Rajesh Kumar',
      credits: 4
    },
    {
      id: 2,
      subjectCode: 'CS602',
      subjectName: 'Database Management Systems',
      subjectType: 'Theory',
      faculty: 'Prof. Sita Devi',
      credits: 4
    },
    {
      id: 3,
      subjectCode: 'CS603',
      subjectName: 'Operating Systems',
      subjectType: 'Theory',
      faculty: 'Dr. Anil Sharma',
      credits: 3
    },
    {
      id: 4,
      subjectCode: 'CS604',
      subjectName: 'Computer Networks',
      subjectType: 'Theory',
      faculty: 'Prof. Meera Reddy',
      credits: 3
    },
    {
      id: 5,
      subjectCode: 'CS605',
      subjectName: 'Software Engineering',
      subjectType: 'Theory',
      faculty: 'Dr. Vikram Singh',
      credits: 3
    },
    {
      id: 6,
      subjectCode: 'CS651',
      subjectName: 'DBMS Lab',
      subjectType: 'Lab',
      faculty: 'Prof. Ramesh Babu',
      credits: 2
    },
    {
      id: 7,
      subjectCode: 'CS652',
      subjectName: 'OS Lab',
      subjectType: 'Lab',
      faculty: 'Dr. Lakshmi Priya',
      credits: 2
    },
    {
      id: 8,
      subjectCode: 'CS661',
      subjectName: 'Machine Learning (Elective)',
      subjectType: 'Elective',
      faculty: 'Dr. Suresh Reddy',
      credits: 3
    },
    {
      id: 9,
      subjectCode: 'CS662',
      subjectName: 'Web Technologies (Minor)',
      subjectType: 'Minor',
      faculty: 'Prof. Kavita Sharma',
      credits: 2
    },
    {
      id: 10,
      subjectCode: 'CS663',
      subjectName: 'Cyber Security (Honors)',
      subjectType: 'Honors',
      faculty: 'Dr. Arjun Patel',
      credits: 3
    }
  ];

  const handlePublish = () => {
    setIsPublished(true);
    setShowPublishModal(false);
    // In real app: API call to publish feedback
  };

  const getSubjectTypeColor = (type) => {
    const colors = {
      'Theory': 'bg-blue-100 text-blue-700 border-blue-200',
      'Lab': 'bg-purple-100 text-purple-700 border-purple-200',
      'Elective': 'bg-orange-100 text-orange-700 border-orange-200',
      'Minor': 'bg-teal-100 text-teal-700 border-teal-200',
      'Honors': 'bg-pink-100 text-pink-700 border-pink-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Send className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Publish Feedback Form</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to publish this feedback form? Students will be able to submit feedback for all subjects shown in the timetable.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Publish
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Semester Timetable</h1>
        <p className="text-sm text-gray-600 mt-1">Review subjects and faculty mapping</p>
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
        <span className="font-medium text-blue-600 whitespace-nowrap">Timetable</span>
      </div>

      {/* Info Card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div>
            <p className="text-xs text-gray-600">Batch</p>
            <p className="text-sm font-bold text-gray-900">{batch.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Regulation</p>
            <p className="text-sm font-bold text-gray-900">{regulation}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Semester</p>
            <p className="text-sm font-bold text-gray-900">{semester.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Status</p>
            <div className="flex items-center gap-2">
              {isPublished ? (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
                  <CheckCircle className="h-3 w-3" />
                  Published
                </span>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200">
                  <Clock className="h-3 w-3" />
                  Draft
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timetable */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Subject-Faculty Mapping</h2>
        
        {/* Desktop View */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Subject Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Subject Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Faculty</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {timetable.map((subject) => (
                  <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{subject.subjectCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{subject.subjectName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getSubjectTypeColor(subject.subjectType)}`}>
                        {subject.subjectType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {subject.faculty}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{subject.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 mb-6">
          {timetable.map((subject) => (
            <div key={subject.id} className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-600">Subject Code</p>
                  <p className="text-sm font-bold text-gray-900">{subject.subjectCode}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getSubjectTypeColor(subject.subjectType)}`}>
                  {subject.subjectType}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{subject.subjectName}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <User className="h-4 w-4" />
                {subject.faculty}
              </div>
              <div className="text-sm text-gray-600">
                Credits: <span className="font-medium text-gray-900">{subject.credits}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Publish Button */}
        {!isPublished && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
            <button
              onClick={() => setShowPublishModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Send className="h-5 w-5" />
              Publish Feedback Form
            </button>
          </motion.div>
        )}

        {isPublished && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
          >
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Feedback Form Published!</h3>
            <p className="text-sm text-gray-600">Students can now submit feedback for this semester.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TimetableView;
