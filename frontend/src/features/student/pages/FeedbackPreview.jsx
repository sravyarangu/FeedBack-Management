import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Send, Edit, CheckCircle, MapPin, Star, AlertCircle, X } from 'lucide-react';

const FeedbackPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { semesterId } = useParams();
  const { feedbackData } = location.state || { feedbackData: [] };

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'incomplete', 'confirm', 'success'
  const [incompleteCount, setIncompleteCount] = useState(0);

  const questions = [
    "How would you rate the faculty's teaching effectiveness?",
    "How would you rate the faculty's subject knowledge and expertise?",
    "How well does the faculty communicate complex concepts?",
    "How approachable and helpful is the faculty during office hours?",
    "How effectively does the faculty use teaching aids and technology?",
    "How well does the faculty encourage student participation?",
    "How fair and transparent is the faculty's evaluation process?",
    "How well does the faculty provide timely feedback on assignments?",
    "How organized and well-structured are the lectures?",
    "How relevant is the course content to practical applications?",
    "How punctual and regular is the faculty?",
    "How well does the faculty handle student queries and doubts?",
    "How effectively does the faculty maintain classroom discipline?",
    "How innovative are the teaching methods used?",
    "How well does the faculty inspire interest in the subject?",
    "How accessible are the course materials and resources?",
    "How well does the faculty relate theory to real-world examples?",
    "How balanced is the workload assigned by the faculty?",
    "How encouraging is the faculty towards academic excellence?",
    "Overall, how satisfied are you with this faculty's teaching?"
  ];

  const getRatingLabel = (rating) => {
    const labels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
    return labels[rating] || 'Not Rated';
  };

  const getRatingColor = (rating) => {
    const colors = {
      1: 'text-red-600 bg-red-50',
      2: 'text-orange-600 bg-orange-50',
      3: 'text-yellow-600 bg-yellow-50',
      4: 'text-blue-600 bg-blue-50',
      5: 'text-green-600 bg-green-50',
    };
    return colors[rating] || 'text-gray-600 bg-gray-50';
  };

  const completedCount = feedbackData.filter((item) => item.rating !== null).length;
  const totalCount = feedbackData.length || 1; // avoid NaN
  const isComplete = completedCount === totalCount;
  const completionPercent = Math.round((completedCount / totalCount) * 100);

  const handleSubmit = () => {
    if (!isComplete) {
      setIncompleteCount(totalCount - completedCount);
      setModalType('incomplete');
      setShowModal(true);
      return;
    }
    setModalType('confirm');
    setShowModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowModal(false);
    setTimeout(() => {
      setModalType('success');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/student/dashboard');
      }, 2000);
    }, 300);
  };

  // Calculate analytics
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;
  let ratedCount = 0;

  feedbackData.forEach((item) => {
    if (item.rating !== null) {
      ratingDistribution[item.rating]++;
      totalRating += item.rating;
      ratedCount++;
    }
  });

  const averageRating = ratedCount > 0 ? (totalRating / ratedCount).toFixed(2) : 0;
  const maxRating = Math.max(...Object.values(ratingDistribution));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Top header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Feedback Journey Map
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Visualize your responses as a path of checkpoints before submission.
            </p>
          </div>
        </motion.div>

        {/* Summary + radial progress */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-4 md:gap-6 mb-6"
        >
          {/* Progress card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg">
            <div className="relative">
              <svg className="w-32 h-32 -rotate-90">
                <circle
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  r="48"
                  cx="64"
                  cy="64"
                />
                <motion.circle
                  className={isComplete ? 'text-green-500' : 'text-blue-500'}
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  r="48"
                  cx="64"
                  cy="64"
                  initial={{ strokeDasharray: 2 * Math.PI * 48, strokeDashoffset: 2 * Math.PI * 48 }}
                  animate={{
                    strokeDasharray: 2 * Math.PI * 48,
                    strokeDashoffset: (2 * Math.PI * 48 * (100 - completionPercent)) / 100,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center ">
                <span className="text-2xl font-semibold text-gray-900">{completionPercent}%</span>
                <span className="text-[11px] uppercase tracking-wide text-gray-500">
                  Complete
                </span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm font-medium text-gray-900">
                {completedCount}/{totalCount} checkpoints cleared
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {isComplete
                  ? 'All feedback checkpoints completed. Ready to submit.'
                  : 'Scroll through the journey below and finish remaining items.'}
              </p>
            </div>
          </div>

          {/* Info + actions */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${isComplete ? 'bg-green-100' : 'bg-amber-100'}`}>
                <CheckCircle
                  className={`h-5 w-5 ${
                    isComplete ? 'text-green-600' : 'text-amber-600'
                  }`}
                />
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isComplete ? 'text-green-700' : 'text-amber-700'
                  }`}
                >
                  {isComplete ? 'Journey complete' : 'Journey in progress'}
                </p>
                <p className="text-xs text-gray-600">
                  {isComplete
                    ? 'You can submit your feedback now.'
                    : `You still have ${totalCount - completedCount} checkpoints to complete.`}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                onClick={() => navigate(`/student/semester/${semesterId}`)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit responses
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isComplete}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-4 w-4" />
                Submit feedback
              </button>
            </div>
          </div>
        </motion.div>

        {/* Timeline map of feedback */}
        {/* <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                Feedback route
              </h2>
              <p className="text-xs text-gray-500">
                Each checkpoint represents a question for a specific faculty and subject.
              </p>
            </div>
          </div>

          <div className="relative">
            
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-100 pointer-events-none" />

            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {feedbackData.map((item, index) => {
                const rated = item.rating != null;
                const label = getRatingLabel(item.rating);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.01 }}
                    className="flex gap-4"
                  >
                   
                    <div className="flex flex-col items-center pt-1">
                      <div
                        className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          rated
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 bg-gray-100'
                        }`}
                      >
                        <MapPin
                          className={`h-4 w-4 ${
                            rated ? 'text-green-600' : 'text-gray-400'
                          }`}
                        />
                        <span className="absolute -right-4 -top-2 text-[10px] text-gray-500">
                          #{index + 1}
                        </span>
                      </div>
                      {index !== feedbackData.length - 1 && (
                        <div className="flex-1 w-px bg-gray-200 mt-1" />
                      )}
                    </div>

                
                    <div className="flex-1">
                      <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 hover:border-gray-300 hover:shadow-sm transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <div>
                            <p className="text-xs font-semibold text-gray-900">
                              {item.facultyName}
                            </p>
                            <p className="text-[11px] text-gray-600">
                              {item.subject} • Question {item.table}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${getRatingColor(
                                item.rating
                              )}`}
                            >
                              {item.rating ? (
                                <>
                                  <Star className="h-3 w-3" />
                                  <span>{item.rating}/5</span>
                                  <span className="hidden sm:inline">• {label}</span>
                                </>
                              ) : (
                                <span>Not rated</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-700">
                          {questions[item.table - 1] || 'Question not found'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div> */}

        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 space-y-4"
        >
          {/* Analytics Header */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Feedback Analytics</h2>

            {/* Rating Distribution */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Rating Distribution</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingDistribution[rating];
                  const percentage = ratedCount > 0 ? (count / ratedCount) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-gray-700">{rating}</span>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            rating === 5 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            rating === 4 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                            rating === 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            rating === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="text-xs font-medium text-gray-700">{count} responses</span>
                          <span className="text-xs font-medium text-gray-700">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Most Common Rating</p>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-bold text-gray-900">
                    {Object.entries(ratingDistribution).reduce((a, b) => a[1] > b[1] ? a : b)[0]} Stars
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Positive Ratings</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold text-gray-900">
                    {ratingDistribution[4] + ratingDistribution[5]} ({((ratingDistribution[4] + ratingDistribution[5]) / ratedCount * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Total Questions</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{totalCount} Items</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Incomplete Feedback Modal */}
              {modalType === 'incomplete' && (
                <>
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Incomplete Feedback</h3>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 text-sm mb-4">
                      Please complete all feedback before submitting. You still have{' '}
                      <span className="font-bold text-orange-600">{incompleteCount} unanswered questions</span>.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        Continue Editing
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Confirmation Modal */}
              {modalType === 'confirm' && (
                <>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <Send className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Confirm Submission</h3>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 text-sm mb-6">
                      Are you sure you want to submit your feedback?{' '}
                      <span className="font-semibold text-red-600">This action cannot be undone.</span>
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmSubmit}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        Yes, Submit
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Success Modal */}
              {modalType === 'success' && (
                <>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Success!</h3>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <p className="text-gray-700 text-sm font-medium">
                      Feedback submitted successfully!
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                      Redirecting to dashboard...
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackPreview;
