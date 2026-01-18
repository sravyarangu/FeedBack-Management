import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, ChevronRight, ChevronLeft, Eye, ChevronDown, User, BookOpen } from 'lucide-react';

const SemesterFeedback = () => {
  const navigate = useNavigate();
  const { semesterId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2; // 5 faculty per page, 10 total

  const facultyList = [
    { id: 0, name: 'Dr. Smith', subject: 'Data Structures' },
    { id: 1, name: 'Prof. Johnson', subject: 'Algorithms' },
    { id: 2, name: 'Dr. Williams', subject: 'Database Systems' },
    { id: 3, name: 'Prof. Brown', subject: 'Operating Systems' },
    { id: 4, name: 'Dr. Jones', subject: 'Computer Networks' },
    { id: 5, name: 'Prof. Davis', subject: 'Software Engineering' },
    { id: 6, name: 'Dr. Miller', subject: 'Web Development' },
    { id: 7, name: 'Prof. Wilson', subject: 'Machine Learning' },
    { id: 8, name: 'Dr. Moore', subject: 'AI' },
    { id: 9, name: 'Prof. Taylor', subject: 'Cloud Computing' }
  ];

  const questions = [
    "Teacher is prepared for class and good at blackboard management.",
    "Teacher knows his/her subject. His lecture is audible and expressive with clarity.",
    "Teacher is organized and neat. Teacher has clear classroom procedures so students don't waste time.",
    "Teacher is punctual to the class, plans class time and help students to solve problems and think critically.",
    "Teacher is flexible in accommodating for individual student needs.",
    "Teacher is clear in giving directions and on explaining what is expected on tests.",
    "Teacher allows you to be active in the classroom learning environment.",
    "Teacher manages the time well and covers the syllabus.",
    "Teacher awards marks fairly. Teacher conducts examination as per schedule.",
    "I have learned a lot about this subject and the teacher motivates the students.",
    "Teacher gives me good feedback so that I can improve.",
    "Teacher uses advanced teaching aids. Teacher is creative in developing activities.",
    "Teacher encourages students to speak up and be active in the class.",
    "Teacher follows through on what he/she says. You can count on the teacher's word.",
    "Teacher listens and understands students' point of view.",
    "Teacher adjusts class work when on leave or compensates missed classes.",
    "Teacher is consistent, fair and firm in discipline without being too strict.",
    "Teacher is sensitive to the needs of students. Teacher likes and respects students.",
    "Teacher helps you when you ask for help.",
    "Teacher's words and actions match. I trust this teacher."
  ];

  // Generate feedback data: 10 faculty × 20 questions = 200 ratings
  const generateFeedbackData = () => {
    const data = [];
    for (let facultyIndex = 0; facultyIndex < 10; facultyIndex++) {
      for (let questionIndex = 0; questionIndex < 20; questionIndex++) {
        data.push({
          id: `f${facultyIndex}-q${questionIndex}`,
          facultyIndex: facultyIndex,
          questionIndex: questionIndex,
          facultyName: facultyList[facultyIndex].name,
          subject: facultyList[facultyIndex].subject,
          rating: null
        });
      }
    }
    return data;
  };

  const [feedbackData, setFeedbackData] = useState(generateFeedbackData());
  const [expandedFaculty, setExpandedFaculty] = useState({});

  const handleRatingChange = (id, rating) => {
    setFeedbackData(prev => 
      prev.map(item => item.id === id ? { ...item, rating } : item)
    );
  };

  const toggleFaculty = (facultyIndex) => {
    setExpandedFaculty(prev => ({
      ...prev,
      [facultyIndex]: !prev[facultyIndex]
    }));
  };

  // Get faculty for current page: Page 1: 5 faculty, Page 2: 5 faculty
  const getFacultyForPage = (page) => {
    if (page === 1) return [0, 1, 2, 3, 4];
    if (page === 2) return [5, 6, 7, 8, 9];
    return [];
  };

  const getFacultyData = (facultyIndex) => {
    return feedbackData.filter(item => item.facultyIndex === facultyIndex);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreview = () => {
    navigate(`/student/semester/${semesterId}/preview`, { state: { feedbackData } });
  };

  const handleDemoFill = () => {
    setFeedbackData(prev => 
      prev.map(item => ({
        ...item,
        rating: Math.floor(Math.random() * 5) + 1
      }))
    );
  };

  const FacultyCard = ({ facultyIndex }) => {
    const faculty = facultyList[facultyIndex];
    const facultyData = getFacultyData(facultyIndex);
    const isExpanded = expandedFaculty[facultyIndex];
    const filledCount = facultyData.filter(item => item.rating !== null).length;
    
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFaculty(facultyIndex);
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 flex items-center justify-between gap-3 hover:from-blue-700 hover:to-blue-800 transition-all focus:outline-none touch-manipulation"
        >
          <div className="flex items-center gap-3 flex-1 text-left">
            <div className="shrink-0 w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base">{faculty.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <BookOpen className="h-3 w-3 text-blue-200" />
                <span className="text-blue-100 text-xs sm:text-sm">{faculty.subject}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${filledCount === 20 ? 'bg-green-400 text-gray-900' : 'bg-yellow-400 text-gray-900'}`}>
              {filledCount}/20
            </span>
            <ChevronDown className={`h-5 w-5 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </button>
        
        {isExpanded && (
          <div className="p-3 sm:p-4">
            <div className="mb-3 pb-3 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-gray-700">Rating Scale:</span>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-600 font-medium">1-Poor</span>
                <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-600 font-medium">2-Fair</span>
                <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-600 font-medium">3-Avg</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-600 font-medium">4-Good</span>
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-600 font-medium">5-Excellent</span>
              </div>
            </div>
            <div className="space-y-2">
              {facultyData.map((item, idx) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{questions[idx]}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <label 
                        key={rating} 
                        className="flex items-center cursor-pointer group"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRatingChange(item.id, rating);
                        }}
                      >
                        <input
                          type="radio"
                          name={`rating-${item.id}`}
                          value={rating}
                          checked={item.rating === rating}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 cursor-pointer pointer-events-none"
                        />
                        <span className="ml-1 text-xs text-gray-700 group-hover:text-blue-600 font-medium pointer-events-none">{rating}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-18 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm overflow-x-auto">
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900 transition-colors shrink-0">
              <Home className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            <button onClick={() => navigate('/student/dashboard')} className="text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap">
              Dashboard
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="text-gray-500 whitespace-nowrap">Semester {semesterId}</span>
            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="font-semibold text-blue-600 whitespace-nowrap">Page {currentPage}</span>
          </div>
          <button onClick={() => navigate('/student/dashboard')} className="text-sm lg:text-base text-blue-600 hover:text-blue-700 font-semibold whitespace-nowrap ml-2">
            ← Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Semester {semesterId} Feedback</h1>
            <p className="text-sm lg:text-base text-gray-500 mt-2">Rate each faculty member on 20 parameters • Page {currentPage} of {totalPages}</p>
          </div>
          <button
            onClick={handleDemoFill}
            className="px-5 py-2.5 lg:py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm lg:text-base font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            🎲 Demo Fill
          </button>
        </motion.div>

        {/* Faculty Cards */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-5 lg:space-y-6">
          {getFacultyForPage(currentPage).map(fIndex => (
            <FacultyCard key={fIndex} facultyIndex={fIndex} />
          ))}
        </motion.div>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 lg:mt-10 bg-white rounded-2xl px-5 lg:px-8 py-4 lg:py-6 shadow-xl border border-gray-100">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 lg:py-3 text-sm lg:text-base font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Previous
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo(0, 0);
                }}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentPage < totalPages ? (
            <button
              onClick={handleNextPage}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          ) : (
            <button
              onClick={handlePreview}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:shadow-lg transition-all"
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Preview & Submit
            </button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 sm:mt-6 bg-white rounded-lg p-3 sm:p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600">OVERALL PROGRESS</span>
            <span className="text-xs sm:text-sm font-medium text-gray-900">
              {feedbackData.filter(item => item.rating !== null).length}/200 Ratings
            </span>
          </div>
          <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${(feedbackData.filter(item => item.rating !== null).length / 200) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemesterFeedback;