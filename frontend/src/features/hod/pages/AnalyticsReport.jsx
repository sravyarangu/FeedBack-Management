import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronDown,
  BarChart3, 
  Download, 
  RefreshCw, 
  FileText
} from 'lucide-react';

const AnalyticsReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { batch, regulation, semester, hodInfo } = location.state || {};
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState(null);

  if (!batch || !regulation || !semester) {
    navigate('/hod/feedback-analytics');
    return null;
  }

  // 20 questions template for each subject (same as student feedback questions)
  const questionTemplate = [
    { id: 1, question: "Teacher is prepared for class and good at blackboard management." },
    { id: 2, question: "Teacher knows his/her subject. His lecture is audible and expressive with clarity." },
    { id: 3, question: "Teacher is organized and neat. Teacher has clear classroom procedures so students don't waste time." },
    { id: 4, question: "Teacher is punctual to the class, plans class time and help students to solve problems and think critically." },
    { id: 5, question: "Teacher is flexible in accommodating for individual student needs." },
    { id: 6, question: "Teacher is clear in giving directions and on explaining what is expected on tests." },
    { id: 7, question: "Teacher allows you to be active in the classroom learning environment." },
    { id: 8, question: "Teacher manages the time well and covers the syllabus." },
    { id: 9, question: "Teacher awards marks fairly. Teacher conducts examination as per schedule." },
    { id: 10, question: "I have learned a lot about this subject and the teacher motivates the students." },
    { id: 11, question: "Teacher gives me good feedback so that I can improve." },
    { id: 12, question: "Teacher uses advanced teaching aids. Teacher is creative in developing activities." },
    { id: 13, question: "Teacher encourages students to speak up and be active in the class." },
    { id: 14, question: "Teacher follows through on what he/she says. You can count on the teacher's word." },
    { id: 15, question: "Teacher listens and understands students' point of view." },
    { id: 16, question: "Teacher adjusts class work when on leave or compensates missed classes." },
    { id: 17, question: "Teacher is consistent, fair and firm in discipline without being too strict." },
    { id: 18, question: "Teacher is sensitive to the needs of students. Teacher likes and respects students." },
    { id: 19, question: "Teacher helps you when you ask for help." },
    { id: 20, question: "Teacher's words and actions match. I trust this teacher." }
  ];

  // Generate random ratings for each question (simulating different ratings per subject)
  const generateQuestionRatings = (baseRating, responses) => {
    return questionTemplate.map(q => ({
      ...q,
      avgRating: Math.min(5, Math.max(3, baseRating + (Math.random() * 0.6 - 0.3))).toFixed(1),
      totalResponses: responses
    }));
  };

  // Mock subject-wise performance with question-wise data
  const subjectPerformance = [
    { id: 1, subjectCode: 'CS401', subjectName: 'Data Structures', faculty: 'Dr. A. Kumar', avgRating: 4.5, responses: 48, type: 'Theory' },
    { id: 2, subjectCode: 'CS402', subjectName: 'Database Management Systems', faculty: 'Dr. B. Sharma', avgRating: 4.3, responses: 48, type: 'Theory' },
    { id: 3, subjectCode: 'CS403', subjectName: 'Operating Systems', faculty: 'Dr. C. Reddy', avgRating: 4.4, responses: 48, type: 'Theory' },
    { id: 4, subjectCode: 'CS404', subjectName: 'Computer Networks', faculty: 'Dr. D. Patel', avgRating: 4.2, responses: 48, type: 'Theory' },
    { id: 5, subjectCode: 'CS405', subjectName: 'Software Engineering', faculty: 'Dr. E. Singh', avgRating: 4.6, responses: 48, type: 'Theory' },
    { id: 6, subjectCode: 'CS406', subjectName: 'DBMS Lab', faculty: 'Prof. F. Gupta', avgRating: 4.4, responses: 48, type: 'Lab' },
    { id: 7, subjectCode: 'CS407', subjectName: 'OS Lab', faculty: 'Prof. G. Rao', avgRating: 4.3, responses: 48, type: 'Lab' },
    { id: 8, subjectCode: 'CS408', subjectName: 'Machine Learning', faculty: 'Dr. H. Verma', avgRating: 4.5, responses: 48, type: 'Elective' },
    { id: 9, subjectCode: 'CS409', subjectName: 'Web Technologies', faculty: 'Prof. I. Khan', avgRating: 4.2, responses: 48, type: 'Minor' },
    { id: 10, subjectCode: 'CS410', subjectName: 'Cyber Security', faculty: 'Dr. J. Mehta', avgRating: 4.7, responses: 48, type: 'Honors' }
  ].map(subject => ({
    ...subject,
    questions: generateQuestionRatings(subject.avgRating, subject.responses)
  }));

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleExport = () => {
    alert('Report export functionality will be implemented');
  };

  const toggleSubject = (subjectId) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
  };

  const getRatingColor = (rating) => {
    const r = parseFloat(rating);
    if (r >= 4.5) return 'text-green-600 bg-green-100';
    if (r >= 4.0) return 'text-blue-600 bg-blue-100';
    if (r >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getRatingBarColor = (rating) => {
    const r = parseFloat(rating);
    if (r >= 4.5) return 'bg-green-500';
    if (r >= 4.0) return 'bg-blue-500';
    if (r >= 3.5) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getSubjectTypeColor = (type) => {
    const colors = {
      'Theory': 'bg-blue-100 text-blue-700',
      'Lab': 'bg-purple-100 text-purple-700',
      'Elective': 'bg-orange-100 text-orange-700',
      'Minor': 'bg-teal-100 text-teal-700',
      'Honors': 'bg-pink-100 text-pink-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Feedback Analytics Report</h1>
            <p className="text-sm lg:text-base text-gray-500 mt-2">Detailed analysis of student feedback</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 lg:h-5 lg:w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm lg:text-base font-medium">Refresh</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              <Download className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base font-medium">Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 lg:mb-8">
        <button onClick={() => navigate('/hod/dashboard')} className="hover:text-blue-600">Dashboard</button>
        <ChevronRight className="h-4 w-4" />
        <button onClick={() => navigate('/hod/feedback-analytics')} className="hover:text-blue-600">Analytics</button>
        <ChevronRight className="h-4 w-4" />
        <span>{batch.name}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-semibold text-blue-600">Report</span>
      </div>

      {/* Context Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-5 lg:p-6 mb-6 lg:mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
          <div>
            <p className="text-sm text-gray-500">Batch</p>
            <p className="text-base lg:text-lg font-bold text-gray-900">{batch.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Regulation</p>
            <p className="text-base lg:text-lg font-bold text-gray-900">{regulation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Semester</p>
            <p className="text-base lg:text-lg font-bold text-gray-900">{semester.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Subjects</p>
            <p className="text-base lg:text-lg font-bold text-gray-900">{subjectPerformance.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Subject-wise Performance with Expandable Question Analysis */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-xl p-5 lg:p-8"
      >
        <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-purple-100 rounded-xl flex items-center justify-center">
            <FileText className="h-6 w-6 lg:h-7 lg:w-7 text-purple-600" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Subject-wise Feedback</h2>
            <p className="text-sm lg:text-base text-gray-500 hidden sm:block">Click on a subject to view detailed question-wise analysis</p>
          </div>
        </div>

        <div className="space-y-4 lg:space-y-5">
          {subjectPerformance.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-2 border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Subject Header - Clickable */}
              <button
                onClick={() => toggleSubject(subject.id)}
                className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{subject.subjectCode}</p>
                    <p className="text-xs text-gray-600 truncate max-w-[100px] sm:max-w-none">{subject.subjectName}</p>
                  </div>
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap ${getSubjectTypeColor(subject.type)}`}>
                    {subject.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">{subject.faculty}</p>
                    <p className="text-xs text-gray-400">{subject.responses} responses</p>
                  </div>
                  <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold ${getRatingColor(subject.avgRating)}`}>
                    {subject.avgRating}/5
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform flex-shrink-0 ${expandedSubject === subject.id ? 'rotate-180' : ''}`} 
                  />
                </div>
              </button>

              {/* Expanded Question-wise Analysis */}
              <AnimatePresence>
                {expandedSubject === subject.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t-2 border-gray-200 bg-gray-50"
                  >
                    <div className="p-3 sm:p-4">
                      {/* Faculty Info on Mobile */}
                      <div className="sm:hidden mb-3 sm:mb-4 p-2 sm:p-3 bg-white rounded-lg">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{subject.faculty}</p>
                        <p className="text-xs text-gray-500">{subject.responses} responses</p>
                      </div>

                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900">Question-wise Analysis</h3>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        {subject.questions.map((q) => (
                          <div
                            key={q.id}
                            className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200"
                          >
                            <div className="flex items-start justify-between mb-1.5 sm:mb-2 gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 leading-relaxed">Q{q.id}. {q.question}</p>
                              </div>
                              <div className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${getRatingColor(q.avgRating)}`}>
                                {q.avgRating}/5
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5">
                              <div
                                className={`h-1 sm:h-1.5 rounded-full ${getRatingBarColor(q.avgRating)}`}
                                style={{ width: `${(parseFloat(q.avgRating) / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsReport;
