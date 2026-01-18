import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, ChevronRight, Calendar, CheckCircle, FileText, Download, ArrowLeft } from 'lucide-react';

const FeedbackReceipt = () => {
  const navigate = useNavigate();
  const { semesterId } = useParams();

  const receiptData = {
    1: { semester: 'Semester 3-1', status: 'Not Submitted', submittedDate: null },
    2: { semester: 'Semester 2-2', status: 'Submitted', submittedDate: 'May 10, 2024 at 8:00 PM' },
    3: { semester: 'Semester 2-1', status: 'Submitted', submittedDate: 'Dec 1, 2023 at 3:45 PM' }
  };

  const receipt = receiptData[semesterId] || receiptData[2];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">
              <Home className="h-4 w-4" />
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <button onClick={() => navigate('/student/dashboard')} className="text-gray-600 hover:text-blue-600">
              Dashboard
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="font-medium text-blue-600">Receipt</span>
          </div>
          <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Feedback Receipt</h1>
          <p className="text-sm text-gray-600 mt-1">{receipt.semester}</p>
        </motion.div>

        {receipt.status === 'Submitted' ? (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Feedback Submitted Successfully</h2>
                  <p className="text-sm text-gray-600 mt-1">Submitted on {receipt.submittedDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Student Name</p>
                  <p className="text-sm font-medium text-gray-900">Ravi Kumar Sharma</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Roll Number</p>
                  <p className="text-sm font-medium text-gray-900">CSE2024001</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Semester</p>
                  <p className="text-sm font-medium text-gray-900">{receipt.semester}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Submission Date</p>
                  <p className="text-sm font-medium text-gray-900">{receipt.submittedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Responses</p>
                  <p className="text-sm font-medium text-gray-900">100 Questions</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="text-sm font-medium text-green-600">✓ Completed</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-bold text-blue-900 mb-2">Receipt Information</h3>
                <p className="text-xs text-blue-700">
                  This receipt confirms that your feedback for {receipt.semester} has been successfully submitted. 
                  Your responses are anonymous and will be used to improve the quality of education.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Receipt
                </button>
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Feedback Summary</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your feedback covered {questions.length} different aspects across multiple subjects and faculty members.
              </p>
              <div className="space-y-2">
                {questions.slice(0, 5).map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{q}</span>
                  </div>
                ))}
                <p className="text-xs text-gray-500 italic">... and 15 more questions</p>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Receipt Available</h2>
            <p className="text-sm text-gray-600 mb-6">
              Feedback for {receipt.semester} has not been submitted yet.
            </p>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeedbackReceipt;