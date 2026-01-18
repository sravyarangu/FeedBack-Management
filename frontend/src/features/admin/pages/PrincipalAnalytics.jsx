import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ChevronRight, ChevronDown, GraduationCap, Calendar, BookOpen, BarChart3, Building2, Layers } from 'lucide-react';

const PrincipalAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedRegulation, setSelectedRegulation] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  // Get role display name
  const getRoleDisplayName = () => {
    if (user?.adminRole === 'principal') return 'Principal';
    if (user?.adminRole === 'vice-principal') return 'Vice Principal';
    return 'Administrator';
  };

  // Get role-based colors to match sidebar
  const getRoleGradient = () => {
    if (user?.adminRole === 'principal') return 'from-amber-500 to-orange-600';
    if (user?.adminRole === 'vice-principal') return 'from-teal-500 to-cyan-600';
    return 'from-purple-500 to-indigo-600';
  };

  const getRoleBgLight = () => {
    if (user?.adminRole === 'principal') return 'from-orange-50 to-amber-50';
    if (user?.adminRole === 'vice-principal') return 'from-teal-50 to-cyan-50';
    return 'from-purple-50 to-indigo-50';
  };

  const getRoleBorderColor = () => {
    if (user?.adminRole === 'principal') return 'border-orange-200';
    if (user?.adminRole === 'vice-principal') return 'border-teal-200';
    return 'border-purple-200';
  };

  const getRoleTextColor = () => {
    if (user?.adminRole === 'principal') return 'text-orange-600';
    if (user?.adminRole === 'vice-principal') return 'text-teal-600';
    return 'text-purple-600';
  };

  const getRoleTagBg = () => {
    if (user?.adminRole === 'principal') return 'bg-orange-50 border-orange-200';
    if (user?.adminRole === 'vice-principal') return 'bg-teal-50 border-teal-200';
    return 'bg-purple-50 border-purple-200';
  };

  const getRoleTagPillBg = () => {
    if (user?.adminRole === 'principal') return 'bg-orange-100 text-orange-700';
    if (user?.adminRole === 'vice-principal') return 'bg-teal-100 text-teal-700';
    return 'bg-purple-100 text-purple-700';
  };

  const getRoleTagTextColor = () => {
    if (user?.adminRole === 'principal') return 'text-orange-800';
    if (user?.adminRole === 'vice-principal') return 'text-teal-800';
    return 'text-purple-800';
  };

  // All program options including MCA, MBA
  const programs = [
    { id: 'btech', name: 'B.Tech', duration: 4 },
    { id: 'mtech', name: 'M.Tech', duration: 2 },
    { id: 'mca', name: 'MCA', duration: 3 },
    { id: 'mba', name: 'MBA', duration: 3 }
  ];

  // Branches based on program
  const branchesByProgram = {
    'btech': [
      { id: 'cse', name: 'CSE', fullName: 'Computer Science and Engineering' },
      { id: 'ece', name: 'ECE', fullName: 'Electronics and Communication Engineering' },
      { id: 'eee', name: 'EEE', fullName: 'Electrical and Electronics Engineering' },
      { id: 'me', name: 'ME', fullName: 'Mechanical Engineering' },
      { id: 'ce', name: 'CE', fullName: 'Civil Engineering' },
      { id: 'it', name: 'IT', fullName: 'Information Technology' }
    ],
    'mtech': [
      { id: 'mtech-cse', name: 'CSE', fullName: 'Computer Science and Engineering' },
      { id: 'mtech-vlsi', name: 'VLSI', fullName: 'VLSI Design' },
      { id: 'mtech-es', name: 'ES', fullName: 'Embedded Systems' },
      { id: 'mtech-cad', name: 'CAD/CAM', fullName: 'CAD/CAM' }
    ],
    'mca': [
      { id: 'mca-gen', name: 'MCA', fullName: 'Master of Computer Applications' }
    ],
    'mba': [
      { id: 'mba-gen', name: 'MBA General', fullName: 'MBA General' },
      { id: 'mba-fin', name: 'MBA Finance', fullName: 'MBA Finance' },
      { id: 'mba-hr', name: 'MBA HR', fullName: 'MBA Human Resources' },
      { id: 'mba-mkt', name: 'MBA Marketing', fullName: 'MBA Marketing' }
    ]
  };

  // Batch options based on program
  const batchesByProgram = {
    'btech': [
      { id: 1, name: '2025-2029', year: 1, regulations: ['R23'] },
      { id: 2, name: '2024-2028', year: 2, regulations: ['R23'] },
      { id: 3, name: '2023-2027', year: 3, regulations: ['R23', 'R20'] },
      { id: 4, name: '2022-2026', year: 4, regulations: ['R20'] }
    ],
    'mtech': [
      { id: 5, name: '2025-2027', year: 1, regulations: ['R23'] },
      { id: 6, name: '2024-2026', year: 2, regulations: ['R23'] }
    ],
    'mca': [
      { id: 7, name: '2025-2028', year: 1, regulations: ['R23'] },
      { id: 8, name: '2024-2027', year: 2, regulations: ['R23'] },
      { id: 9, name: '2023-2026', year: 3, regulations: ['R23', 'R20'] }
    ],
    'mba': [
      { id: 10, name: '2025-2028', year: 1, regulations: ['R23'] },
      { id: 11, name: '2024-2027', year: 2, regulations: ['R23'] },
      { id: 12, name: '2023-2026', year: 3, regulations: ['R23', 'R20'] }
    ]
  };

  // Get available branches for selected program
  const availableBranches = selectedProgram ? branchesByProgram[selectedProgram] || [] : [];

  // Get available batches for selected program
  const availableBatches = selectedProgram ? batchesByProgram[selectedProgram] || [] : [];

  // Get selected batch object
  const currentBatch = availableBatches.find(b => b.name === selectedBatch);

  // Get available regulations for selected batch
  const availableRegulations = currentBatch?.regulations || [];

  // Get available semesters based on program duration and current year
  const getAvailableSemesters = (year, programId) => {
    if (!year) return [];
    const program = programs.find(p => p.id === programId);
    const maxYear = program?.duration || 4;
    const allSemesters = [];
    // Include all semesters from year 1 up to current year
    for (let y = 1; y <= Math.min(year, maxYear); y++) {
      allSemesters.push(`${y}-1`);
      allSemesters.push(`${y}-2`);
    }
    return allSemesters;
  };

  const availableSemesters = currentBatch ? getAvailableSemesters(currentBatch.year, selectedProgram) : [];

  // Handle program change
  const handleProgramChange = (program) => {
    setSelectedProgram(program);
    setSelectedBranch('');
    setSelectedBatch('');
    setSelectedRegulation('');
    setSelectedSemester('');
  };

  // Handle branch change
  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
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

  // Check if all selections are made
  const isFormComplete = selectedProgram && selectedBranch && selectedBatch && selectedRegulation && selectedSemester;

  // Handle proceed to analytics report
  const handleProceed = () => {
    if (isFormComplete) {
      const selectedBranchData = availableBranches.find(b => b.id === selectedBranch);
      const selectedProgramData = programs.find(p => p.id === selectedProgram);
      
      navigate('/admin/analytics/report', {
        state: {
          program: selectedProgramData,
          branch: selectedBranchData,
          batch: currentBatch,
          regulation: selectedRegulation,
          semester: { id: selectedSemester, name: `Semester ${selectedSemester}` },
          adminRole: user?.adminRole
        }
      });
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Feedback Analytics</h1>
        <p className="text-sm lg:text-base text-gray-500 mt-2">
          {getRoleDisplayName()} - View detailed analytics across all departments
        </p>
      </motion.div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 lg:mb-8">
        <span>Admin Panel</span>
        <ChevronRight className="h-4 w-4" />
        <span className={`font-semibold ${getRoleTextColor()}`}>Feedback Analytics</span>
      </div>

      {/* Role Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`bg-gradient-to-r ${getRoleBgLight()} border ${getRoleBorderColor()} rounded-2xl p-5 lg:p-6 mb-6 lg:mb-8`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${getRoleGradient()} rounded-xl flex items-center justify-center`}>
            <BarChart3 className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Logged in as</p>
            <p className="text-base lg:text-lg font-bold text-gray-900">{getRoleDisplayName()}</p>
          </div>
        </div>
      </motion.div>

      {/* Selection Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 lg:p-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Program Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" />
              Select Program
            </label>
            <div className="relative">
              <select
                value={selectedProgram}
                onChange={(e) => handleProgramChange(e.target.value)}
                className="w-full px-4 py-3 lg:py-3.5 text-sm lg:text-base border-2 border-gray-200 rounded-xl appearance-none bg-white focus:border-orange-500 focus:outline-none transition-colors cursor-pointer hover:border-gray-300"
              >
                <option value="">-- Select Program --</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Branch Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Layers className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" />
              Select Branch
            </label>
            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(e) => handleBranchChange(e.target.value)}
                disabled={!selectedProgram}
                className="w-full px-4 py-3 lg:py-3.5 text-sm lg:text-base border-2 border-gray-200 rounded-xl appearance-none bg-white focus:border-orange-500 focus:outline-none transition-colors cursor-pointer hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">-- Select Branch --</option>
                {availableBranches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name} - {branch.fullName}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Batch Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" />
              Select Batch
            </label>
            <div className="relative">
              <select
                value={selectedBatch}
                onChange={(e) => handleBatchChange(e.target.value)}
                disabled={!selectedBranch}
                className="w-full px-4 py-3 lg:py-3.5 text-sm lg:text-base border-2 border-gray-200 rounded-xl appearance-none bg-white focus:border-orange-500 focus:outline-none transition-colors cursor-pointer hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" />
              Select Regulation
            </label>
            <div className="relative">
              <select
                value={selectedRegulation}
                onChange={(e) => handleRegulationChange(e.target.value)}
                disabled={!selectedBatch}
                className="w-full px-4 py-3 lg:py-3.5 text-sm lg:text-base border-2 border-gray-200 rounded-xl appearance-none bg-white focus:border-orange-500 focus:outline-none transition-colors cursor-pointer hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">-- Select Regulation --</option>
                {availableRegulations.map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Semester Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" />
              Select Semester
            </label>
            <div className="relative">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                disabled={!selectedRegulation}
                className="w-full px-4 py-3 lg:py-3.5 text-sm lg:text-base border-2 border-gray-200 rounded-xl appearance-none bg-white focus:border-orange-500 focus:outline-none transition-colors cursor-pointer hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">-- Select Semester --</option>
                {availableSemesters.map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        {(selectedProgram || selectedBranch || selectedBatch) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={`mt-6 p-4 ${getRoleTagBg()} border rounded-xl`}
          >
            <p className={`text-sm font-semibold ${getRoleTagTextColor()} mb-2`}>Current Selection:</p>
            <div className="flex flex-wrap gap-2">
              {selectedProgram && (
                <span className={`px-3 py-1 ${getRoleTagPillBg()} rounded-full text-sm font-medium`}>
                  {programs.find(p => p.id === selectedProgram)?.name}
                </span>
              )}
              {selectedBranch && (
                <span className={`px-3 py-1 ${getRoleTagPillBg()} rounded-full text-sm font-medium`}>
                  {availableBranches.find(b => b.id === selectedBranch)?.name}
                </span>
              )}
              {selectedBatch && (
                <span className={`px-3 py-1 ${getRoleTagPillBg()} rounded-full text-sm font-medium`}>
                  {selectedBatch}
                </span>
              )}
              {selectedRegulation && (
                <span className={`px-3 py-1 ${getRoleTagPillBg()} rounded-full text-sm font-medium`}>
                  {selectedRegulation}
                </span>
              )}
              {selectedSemester && (
                <span className={`px-3 py-1 ${getRoleTagPillBg()} rounded-full text-sm font-medium`}>
                  Sem {selectedSemester}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Proceed Button */}
        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: isFormComplete ? 1.02 : 1 }}
            whileTap={{ scale: isFormComplete ? 0.98 : 1 }}
            onClick={handleProceed}
            disabled={!isFormComplete}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all ${
              isFormComplete
                ? `bg-gradient-to-r ${getRoleGradient()} hover:shadow-lg cursor-pointer`
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            View Analytics Report
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrincipalAnalytics;
