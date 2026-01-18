import { motion } from 'framer-motion';
import { FileText, Calendar, CheckCircle } from 'lucide-react';

const MySubmissions = () => {
  const submissions = [
    { 
      id: 2, 
      semester: 'Semester 2-2', 
      submittedDate: 'May 10, 2024 at 8:00 PM',
      status: 'completed',
      totalQuestions: 100,
      answered: 100
    },
    { 
      id: 3, 
      semester: 'Semester 2-1', 
      submittedDate: 'Dec 1, 2023 at 3:45 PM',
      status: 'completed',
      totalQuestions: 100,
      answered: 100
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
        <p className="text-sm text-gray-600 mt-1">View your submitted feedback forms</p>
      </motion.div>

      <div className="space-y-4">
        {submissions.map((submission, i) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{submission.semester}</h3>
                  <p className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Submitted on {submission.submittedDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-600">Completion</p>
                  <p className="text-sm font-bold text-green-600">{submission.answered}/{submission.totalQuestions}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MySubmissions;