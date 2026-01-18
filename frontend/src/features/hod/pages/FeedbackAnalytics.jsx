import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, GraduationCap, Calendar, BookOpen, BarChart3, Users } from 'lucide-react';

const FeedbackAnalytics = () => {
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedRegulation, setSelectedRegulation] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const hodInfo = {
    branch: 'CSE'
  };

  // Program options
  const programs = ['B.Tech', 'M.Tech'];

  // Batch options based on program
  const batches = {
    'B.Tech': [
      { id: 1, name: '2025-2029', year: 1, regulations: ['R23'] },
      { id: 2, name: '2024-2028', year: 2, regulations: ['R23'] },
      { id: 3, name: '2023-2027', year: 3, regulations: ['R23', 'R20'] },
      { id: 4, name: '2022-2026', year: 4, regulations: ['R20'] }
    ],
    'M.Tech': [
      { id: 5, name: '2025-2027', year: 1, regulations: ['R23'] },
      { id: 6, name: '2024-2026', year: 2, regulations: ['R23'] }
    ]
  };

  // Get available batches for selected program
  const availableBatches = selectedProgram ? batches[selectedProgram] || [] : [];

  // Get selected batch object
  const currentBatch = availableBatches.find(b => b.name === selectedBatch);

  // Get available regulations for selected batch
  const availableRegulations = currentBatch?.regulations || [];

  // Get available semesters - ALL previous semesters up to and including current year
  const getAvailableSemesters = (year) => {
    if (!year) return [];
    const allSemesters = [];
    // Include all semesters from year 1 up to current year
    for (let y = 1; y <= year; y++) {
      allSemesters.push(`${y}-1`);
      allSemesters.push(`${y}-2`);
    }
    return allSemesters;
  };

  const availableSemesters = currentBatch ? getAvailableSemesters(currentBatch.year) : [];

  // Handle program change
  const handleProgramChange = (program) => {
    setSelectedProgram(program);
    setSelectedBatch('');
    setSelectedRegulation('');
    setSelectedSemester('');
  };

  // Handle batch change
  const handleBatchChange = (batchName) => {
    setSelectedBatch(batchName);
    setSelectedRegulation('');
    setSelectedSemester('');
  };

  // Handle regulation change
  const handleRegulationChange = (regulation) => {
    setSelectedRegulation(regulation);
    setSelectedSemester('');
  };

  // Handle proceed to analytics report
  const handleProceed = () => {
    if (selectedProgram && selectedBatch && selectedRegulation && selectedSemester) {
      navigate('/hod/feedback-analytics/report', {
        state: {
          batch: currentBatch,
          regulation: selectedRegulation,
          semester: { id: selectedSemester, name: `Semester ${selectedSemester}` },
          hodInfo: { ...hodInfo, program: selectedProgram }
        }
      });
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Feedback Analytics</h1>
        <p className="text-sm lg:text-base text-gray-500 mt-2">Select program, batch, regulation and semester to view analytics</p>
      </motion.div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 lg:mb-8">
        <span>Dashboard</span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-semibold text-purple-600">Feedback Analytics</span>
      </div>

      {/* Department Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-purple-50 border border-purple-200 rounded-2xl p-5 lg:p-6 mb-6 lg:mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-purple-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 lg:h-7 lg:w-7 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="text-base lg:text-lg font-bold text-gray-900">{hodInfo.branch}</p>
          </div>
        </div>
      </motion.div>

      {/* Selection Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 lg:p-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-8">
          {/* Program Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600" />
              Select Program
            </label>
            <div className="relative">
              <select
                value={selectedProgram}
                onChange={(e) => handleProgramChange(e.target.value)}
                className="w-full px-4 py-3 lg:py-3.5 text-sm lg:text-base border-2 border-gray-200 rounded-xl appearance-none bg-white focus:border-purple-500 focus:outline-none transition-colors cursor-pointer hover:border-gray-300"
              >
                <option value="">-- Select Program --</option>
                {programs.map((program) => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Batch Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600" />
              Select Batch
            </label>
            <div className="relative">
              <select
                value={selectedBatch}
                onChange={(e) => handleBatchChange(e.target.value)}
                disabled={!selectedProgram}
                className={`w-full px-4 py-3 lg:py-3.5 text-sm lg:text-base border-2 border-gray-200 rounded-xl appearance-none bg-white focus:border-purple-500 focus:outline-none transition-colors ${!selectedProgram ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'}`}
              >
                <option value="">-- Select Batch --</option>
                {availableBatches.map((batch) => (
                  <option key={batch.id} value={batch.name}>
                    {batch.name} (Year {batch.year})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Regulation Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600" />
              Select Regulation
            </label>
            <div className="relative">
              <select
                value={selectedRegulation}
                onChange={(e) => handleRegulationChange(e.target.value)}
                disabled={!selectedBatch}
                className={`w-full px-4 py-3 lg:py-3.5 text-sm lg:text-base border-2 border-gray-200 rounded-xl appearance-none bg-white focus:border-purple-500 focus:outline-none transition-colors ${!selectedBatch ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'}`}
              >
                <option value="">-- Select Regulation --</option>
                {availableRegulations.map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Semester Selection - Shows ALL previous semesters */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600" />
              Select Semester
            </label>
            <div className="relative">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                disabled={!selectedRegulation}
                className={`w-full px-4 py-3 lg:py-3.5 text-sm lg:text-base border-2 border-gray-200 rounded-xl appearance-none bg-white focus:border-purple-500 focus:outline-none transition-colors ${!selectedRegulation ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'}`}
              >
                <option value="">-- Select Semester --</option>
                {availableSemesters.map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {selectedRegulation && availableSemesters.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing all semesters from 1-1 to {currentBatch?.year}-2
              </p>
            )}
          </div>
        </div>

        {/* Selection Summary */}
        {selectedProgram && selectedBatch && selectedRegulation && selectedSemester && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-6 lg:mt-8 p-4 lg:p-5 bg-purple-50 border border-purple-200 rounded-xl"
          >
            <p className="text-sm font-semibold text-purple-800">Selected:</p>
            <p className="text-sm lg:text-base text-purple-700 mt-1">
              {selectedProgram} → {selectedBatch} → {selectedRegulation} → Semester {selectedSemester}
            </p>
          </motion.div>
        )}

        {/* Proceed Button */}
        <div className="mt-6 lg:mt-8">
          <button
            onClick={handleProceed}
            disabled={!selectedProgram || !selectedBatch || !selectedRegulation || !selectedSemester}
            className={`w-full py-3.5 lg:py-4 px-6 rounded-xl text-base font-semibold transition-all ${
              selectedProgram && selectedBatch && selectedRegulation && selectedSemester
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg hover:from-purple-600 hover:to-purple-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            View Analytics Report →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackAnalytics;
