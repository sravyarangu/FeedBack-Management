import React, { useState } from 'react'
import { 
  Users, Upload, BookOpen, 
  Calendar, X, GraduationCap, FileText, MapPin,
  Briefcase, UserCheck, Layers, Save, Download, CheckCircle, Eye
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { students, faculty, subjects, programs, branches, batches, hods } from '../../../shared/constants/student'
import adminService from '../../../services/adminService'

// --- Success Card Component ---
const SuccessCard = ({ uploadData, onClose }) => {
  if (!uploadData.show) return null;

  return (
    <div className="mt-6 animate-in fade-in slide-in-from-top-4">
      {/* Success Message Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-green-500 p-3 rounded-full">
              <CheckCircle size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-900 mb-1">Upload Successful!</h3>
              <p className="text-sm text-green-700 mb-2">{uploadData.type} data has been uploaded successfully</p>
              <div className="flex items-center gap-4 text-xs text-green-600 mt-3">
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span className="font-semibold">{uploadData.fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Size:</span>
                  <span>{uploadData.fileSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Rows:</span>
                  <span>{uploadData.previewData.length - 1}</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-green-600 hover:bg-green-100 p-2 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* File Preview Card */}
      {uploadData.previewData.length > 0 && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
            <div className="flex items-center gap-3">
              <Eye size={20} className="text-white" />
              <h4 className="text-lg font-bold text-white">File Preview</h4>
            </div>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {uploadData.previewData[0]?.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploadData.previewData.slice(1, 6).map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {cell || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {uploadData.previewData.length > 6 && (
              <div className="mt-3 text-center text-xs text-gray-500">
                Showing first 5 rows of {uploadData.previewData.length - 1} total rows
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Reusable Upload Modal Component ---
const UploadModal = ({ isOpen, onClose, title, subtitle, columns, onUpload, file, setFile }) => {
  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls'))) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid Excel file (.xlsx or .xls)');
      e.target.value = null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full transform transition-all">
        {/* Header - Purple Gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Upload size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-sm text-purple-100">{subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Required Columns Info Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 p-2 rounded-lg shrink-0">
                <FileText size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-900 mb-2">Required Excel Columns:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4">
                  {columns.map((col, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-blue-700">{col}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">Select Excel File</label>
            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id={`file-input-${title}`}
              />
              <label
                htmlFor={`file-input-${title}`}
                className="flex items-center justify-center gap-3 w-full px-6 py-10 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group"
              >
                <Upload size={32} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Excel files (.xlsx, .xls) only</p>
                </div>
              </label>
            </div>
            
            {/* Selected File Preview */}
            {file && (
              <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-100 rounded-lg animate-in fade-in slide-in-from-top-2">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <FileText size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-purple-900 truncate">{file.name}</p>
                  <p className="text-xs text-purple-600">Ready to upload</p>
                </div>
                <button onClick={() => setFile(null)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all">
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border-2 border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition-all font-medium">
            Cancel
          </button>
          <button
            onClick={onUpload}
            disabled={!file}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all font-medium flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={18} />
            {title}
          </button>
        </div>
      </div>
    </div>
  );
};


const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('batch-management')

  // --- Upload Success State ---
  const [uploadSuccess, setUploadSuccess] = useState({ show: false, type: '', fileName: '', fileSize: '', previewData: [] })

  // --- State for Management Columns ---
  // Batch
  const [showBatchUpload, setShowBatchUpload] = useState(false)
  const [batchFile, setBatchFile] = useState(null)

  // Program
  const [showProgramUpload, setShowProgramUpload] = useState(false)
  const [programFile, setProgramFile] = useState(null)

  // Branch
  const [showBranchUpload, setShowBranchUpload] = useState(false)
  const [branchFile, setBranchFile] = useState(null)

  // HOD
  const [showHodUpload, setShowHodUpload] = useState(false)
  const [hodFile, setHodFile] = useState(null)

  // Student
  const [showStudentUpload, setShowStudentUpload] = useState(false)
  const [studentFile, setStudentFile] = useState(null)

  // Faculty
  const [showFacultyUpload, setShowFacultyUpload] = useState(false)
  const [facultyFile, setFacultyFile] = useState(null)

  // Subject
  const [showSubjectUpload, setShowSubjectUpload] = useState(false)
  const [subjectFile, setSubjectFile] = useState(null)

  // Feedback Management
  const [feedbackSubsection, setFeedbackSubsection] = useState(null) // 'questions' or 'mapping'
  const [feedbackQuestions, setFeedbackQuestions] = useState([
    { id: 1, sno: 1, criteria: 'Teacher is prepared for class and good at blackboard management.' },
    { id: 2, sno: 2, criteria: 'Teacher knows his/her subject. His lecture is audible and expressive with clarity.' },
    { id: 3, sno: 3, criteria: 'Teacher is organized and neat. Teacher has clear classroom procedures so students don\'t waste time.' },
    { id: 4, sno: 4, criteria: 'Teacher is punctual to the class, plans class time and help students to solve problems and think critically.' },
    { id: 5, sno: 5, criteria: 'Teacher is flexible in accommodating for individual student needs.' },
    { id: 6, sno: 6, criteria: 'Teacher is clear in giving directions and on explaining what is expected on tests.' },
    { id: 7, sno: 7, criteria: 'Teacher allows you to be active in the classroom learning environment.' },
    { id: 8, sno: 8, criteria: 'Teacher manages the time well and covers the syllabus.' },
    { id: 9, sno: 9, criteria: 'Teacher awards marks fairly. Teacher conducts examination as per schedule.' },
    { id: 10, sno: 10, criteria: 'I have learned a lot about this subject and the teacher motivates the students.' },
    { id: 11, sno: 11, criteria: 'Teacher gives me good feedback so that I can improve.' },
    { id: 12, sno: 12, criteria: 'Teacher uses advanced teaching aids. Teacher is creative in developing activities.' },
    { id: 13, sno: 13, criteria: 'Teacher encourages students to speak up and be active in the class.' },
    { id: 14, sno: 14, criteria: 'Teacher follows through on what he/she says. You can count on the teacher\'s word.' },
    { id: 15, sno: 15, criteria: 'Teacher listens and understands students\' point of view.' },
    { id: 16, sno: 16, criteria: 'Teacher adjusts class work when on leave or compensates missed classes.' },
    { id: 17, sno: 17, criteria: 'Teacher is consistent, fair and firm in discipline without being too strict.' },
    { id: 18, sno: 18, criteria: 'Teacher is sensitive to the needs of students. Teacher likes and respects students.' },
    { id: 19, sno: 19, criteria: 'Teacher helps you when you ask for help.' },
    { id: 20, sno: 20, criteria: 'Teacher\'s words and actions match. I trust this teacher.' },
  ])
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [newQuestion, setNewQuestion] = useState('')
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ show: false, questionId: null, questionText: '' })
  
  // Feedback Mapping
  const [mappingForm, setMappingForm] = useState({
    program: '',
    batchYear: '',
    branch: '',
    year: '',
    semester: '',
    subject: '',
    faculty: ''
  })
  const [feedbackMappings, setFeedbackMappings] = useState([])
  const [isPublished, setIsPublished] = useState(false)
  
  // Helper function to calculate end year based on program and start year
  const calculateEndYear = (programId, startYear) => {
    const program = programs.find(p => p.id === Number(programId))
    if (!program || !startYear) return ''
    return Number(startYear) + program.duration
  }
  
  // Handlers
  // Helper function to map Excel column names to backend field names
  const mapExcelDataToBackend = (data, type) => {
    return data.map(row => {
      const mappedRow = {};
      Object.keys(row).forEach(key => {
        const normalizedKey = key.toLowerCase().trim();
        
        // Subject-specific mappings
        if (type === 'Subjects') {
          if (normalizedKey === 'subject code' || normalizedKey === 'code') {
            mappedRow['subjectCode'] = row[key];
          } else if (normalizedKey === 'name' || normalizedKey === 'subject name' || normalizedKey === 'subjectname') {
            mappedRow['subjectName'] = row[key];
          } else if (normalizedKey === 'subject name') {
            mappedRow['subjectName'] = row[key];
          } else if (normalizedKey === 'program') {
            mappedRow['program'] = row[key];
          } else if (normalizedKey === 'branch') {
            mappedRow['branch'] = row[key];
          } else if (normalizedKey === 'regulation') {
            mappedRow['regulation'] = row[key];
          } else if (normalizedKey === 'year') {
            mappedRow['year'] = row[key];
          } else if (normalizedKey === 'semester') {
            mappedRow['semester'] = row[key];
          } else if (normalizedKey === 'type') {
            mappedRow['type'] = row[key];
          }
        }
        // Student mappings
        else if (type === 'Students') {
          if (normalizedKey === 'roll number') {
            mappedRow['rollNo'] = row[key];
          } else if (normalizedKey === 'batch') {
            mappedRow['admittedYear'] = row[key];
          } else if (normalizedKey === 'name') {
            mappedRow['name'] = row[key];
          } else if (normalizedKey === 'dob') {
            mappedRow['dob'] = row[key];
          } else if (normalizedKey === 'branch') {
            mappedRow['branch'] = row[key];
          } else if (normalizedKey === 'program') {
            mappedRow['program'] = row[key];
          } else if (normalizedKey === 'specialisation') {
            mappedRow['specialisation'] = row[key];
          } else if (normalizedKey === 'regulation') {
            mappedRow['regulation'] = row[key];
          }
        }
        // Generic mappings for other types
        else {
          if (normalizedKey === 'batch year') {
            mappedRow['batchYear'] = row[key];
          } else {
            // Default: just copy the value with the original or normalized key
            mappedRow[key] = row[key];
          }
        }
      });
      return mappedRow;
    });
  };

  const handleUploadGeneric = async (file, type, setFile, setShow, bulkUploadFn) => {
    if (!file) {
      alert('Please select an Excel file')
      return
    }
    
    try {
      // Read and parse the Excel file
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet)
          
          // Map Excel column names to backend field names
          const mappedData = mapExcelDataToBackend(jsonData, type);
          
          // Upload to MongoDB
          const response = await bulkUploadFn(mappedData);
          
          // Get file size in readable format
          const fileSize = file.size < 1024 ? file.size + ' B' : 
                          file.size < 1048576 ? (file.size / 1024).toFixed(2) + ' KB' :
                          (file.size / 1048576).toFixed(2) + ' MB'
          
          // Show success message
          alert(`✓ Success! ${type} data has been saved to MongoDB.\n\nFile: ${file.name}\nSize: ${fileSize}\nRecords processed: ${jsonData.length}\n\n${response.message || 'Data uploaded successfully'}`);
          
          setShow(false)
          setFile(null)
        } catch (error) {
          console.error('Upload error:', error);
          alert(`✗ Failed to upload ${type} data to MongoDB.\n\nError: ${error.response?.data?.message || error.message}`);
        }
      }
      reader.readAsArrayBuffer(file)
    } catch (error) {
      alert('Error processing file: ' + error.message)
    }
  }

  const tabs = [
    { id: 'batch-management', label: 'Batch Management', icon: Calendar },
    { id: 'program-management', label: 'Program Management', icon: Briefcase },
    { id: 'branch-management', label: 'Branch Management', icon: Layers },
    { id: 'hod-management', label: 'HOD Management', icon: UserCheck },
    { id: 'student-management', label: 'Student Management', icon: Users },
    { id: 'faculty-management', label: 'Faculty Management', icon: GraduationCap },
    { id: 'subject-management', label: 'Subject Management', icon: BookOpen },
    { id: 'feedback-management', label: 'Feedback Management', icon: MapPin },
  ]

  // Mock upload handlers
  const onUploadBatch = () => handleUploadGeneric(batchFile, 'Batches', setBatchFile, setShowBatchUpload, (data) => adminService.bulkUploadBatches({ batches: data }))
  const onUploadProgram = () => handleUploadGeneric(programFile, 'Programs', setProgramFile, setShowProgramUpload, (data) => adminService.bulkUploadPrograms({ programs: data }))
  const onUploadBranch = () => handleUploadGeneric(branchFile, 'Branches', setBranchFile, setShowBranchUpload, (data) => adminService.bulkUploadBranches({ branches: data }))
  const onUploadHod = () => handleUploadGeneric(hodFile, 'HODs', setHodFile, setShowHodUpload, (data) => adminService.bulkUploadHODs({ hods: data }))
  const onUploadStudent = () => handleUploadGeneric(studentFile, 'Students', setStudentFile, setShowStudentUpload, (data) => adminService.bulkUploadStudents({ students: data }))
  const onUploadFaculty = () => handleUploadGeneric(facultyFile, 'Faculty', setFacultyFile, setShowFacultyUpload, (data) => adminService.bulkUploadFaculty({ faculty: data }))
  const onUploadSubject = () => handleUploadGeneric(subjectFile, 'Subjects', setSubjectFile, setShowSubjectUpload, (data) => adminService.bulkUploadSubjects({ subjects: data }))

  // Feedback Question Handlers
  const handleSaveQuestion = (id, newCriteria) => {
    setFeedbackQuestions(feedbackQuestions.map(q => 
      q.id === id ? { ...q, criteria: newCriteria } : q
    ))
    setEditingQuestion(null)
  }

  const handleDeleteQuestion = (id) => {
    const question = feedbackQuestions.find(q => q.id === id)
    setDeleteConfirmModal({ show: true, questionId: id, questionText: question?.criteria || '' })
  }

  const confirmDeleteQuestion = () => {
    setFeedbackQuestions(feedbackQuestions.filter(q => q.id !== deleteConfirmModal.questionId))
    setDeleteConfirmModal({ show: false, questionId: null, questionText: '' })
  }

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      alert('Please enter a question')
      return
    }
    const maxSno = Math.max(...feedbackQuestions.map(q => q.sno), 0)
    const newId = Math.max(...feedbackQuestions.map(q => q.id), 0) + 1
    setFeedbackQuestions([...feedbackQuestions, {
      id: newId,
      sno: maxSno + 1,
      criteria: newQuestion
    }])
    setNewQuestion('')
  }

  // Feedback Mapping Handlers
  const handleAddMapping = () => {
    const { program, batchYear, branch, year, semester, subject, faculty } = mappingForm
    if (!program || !batchYear || !branch || !year || !semester || !subject || !faculty) {
      alert('Please fill all fields')
      return
    }
    
    const programName = programs.find(p => p.id === Number(program))?.name
    const branchName = branches.find(b => b.id === Number(branch))?.name
    const subjectName = subjects.find(s => s.id === Number(subject))?.subjectName
    const facultyName = faculty.find(f => f.id === Number(mappingForm.faculty))?.facultyName
    
    const newMapping = {
      id: feedbackMappings.length + 1,
      program: programName,
      batchYear,
      branch: branchName,
      year,
      semester,
      subject: subjectName,
      faculty: facultyName,
      ...mappingForm
    }
    
    setFeedbackMappings([...feedbackMappings, newMapping])
    setMappingForm({ program: '', batchYear: '', branch: '', year: '', semester: '', subject: '', faculty: '' })
    alert('Mapping added successfully!')
  }

  const handleDeleteMapping = (id) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      setFeedbackMappings(feedbackMappings.filter(m => m.id !== id))
    }
  }

  const handlePublishMapping = () => {
    if (feedbackMappings.length === 0) {
      alert('Please add at least one mapping before publishing')
      return
    }
    if (window.confirm('Are you sure you want to publish? HODs will be able to see the timetable.')) {
      setIsPublished(true)
      alert('Feedback mapping published successfully! HODs can now view timetables.')
    }
  }

  // Download Template Handlers - Using API Service
  const downloadBatchTemplate = async () => {
    try {
      await adminService.downloadTemplate('batch');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download template');
    }
  };

  const downloadProgramTemplate = async () => {
    try {
      await adminService.downloadTemplate('program');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download template');
    }
  };

  const downloadBranchTemplate = async () => {
    try {
      await adminService.downloadTemplate('branch');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download template');
    }
  };

  const downloadHodTemplate = async () => {
    try {
      await adminService.downloadTemplate('hod');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download template');
    }
  };

  const downloadStudentTemplate = async () => {
    try {
      await adminService.downloadTemplate('student');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download template');
    }
  };

  const downloadFacultyTemplate = async () => {
    try {
      await adminService.downloadTemplate('faculty');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download template');
    }
  };

  const downloadSubjectTemplate = async () => {
    try {
      await adminService.downloadTemplate('subject');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download template');
    }
  };

  const downloadFeedbackQuestionTemplate = async () => {
    try {
      await adminService.downloadTemplate('feedback_questions');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download template');
    }
  };

  const downloadFeedbackMappingTemplate = async () => {
    try {
      await adminService.downloadTemplate('feedback_mapping');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download template');
    }
  };


  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          Super Admin Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-1">Feedback Management System - Full Control</p>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm rounded-xl mb-6">
        <div className="px-2 sm:px-4">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-thin py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 font-semibold transition-all whitespace-nowrap text-xs sm:text-sm md:text-base ${
                  activeTab === tab.id ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <tab.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        
        {/* === BATCH MANAGEMENT === */}
        {activeTab === 'batch-management' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Batch Management</h2>
            <p className="text-sm text-gray-600 mb-6">Upload batch data using Excel files. Download the template to see the required format. <span className="font-semibold">End year will be calculated automatically based on program duration</span> (B.Tech: 4 years, M.Tech: 2 years, MBA: 3 years, MCA: 3 years).</p>
            
            <div className="flex gap-3">
              <button 
                onClick={downloadBatchTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
              >
                <Download size={18} /> Download Template
              </button>
              <button 
                onClick={() => setShowBatchUpload(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
              >
                <Upload size={18} /> Upload Batches
              </button>
            </div>

            {uploadSuccess.show && uploadSuccess.type === 'Batches' && (
              <SuccessCard 
                uploadData={uploadSuccess} 
                onClose={() => setUploadSuccess({ show: false, type: '', fileName: '', fileSize: '', previewData: [] })}
              />
            )}

            <UploadModal
              isOpen={showBatchUpload}
              onClose={() => setShowBatchUpload(false)}
              title="Upload Batches"
              subtitle="Bulk import academic batches"
              columns={['program', 'batch year']}
              onUpload={onUploadBatch}
              file={batchFile}
              setFile={setBatchFile}
            />
          </div>
        )}

        {/* === PROGRAM MANAGEMENT === */}
        {activeTab === 'program-management' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Program Management</h2>
            <p className="text-sm text-gray-600 mb-6">Upload program data using Excel files. Download the template to see the required format.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={downloadProgramTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
              >
                <Download size={18} /> Download Template
              </button>
              <button 
                onClick={() => setShowProgramUpload(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
              >
                <Upload size={18} /> Upload Programs
              </button>
            </div>

            {uploadSuccess.show && uploadSuccess.type === 'Programs' && (
              <SuccessCard 
                uploadData={uploadSuccess} 
                onClose={() => setUploadSuccess({ show: false, type: '', fileName: '', fileSize: '', previewData: [] })}
              />
            )}

            <UploadModal
              isOpen={showProgramUpload}
              onClose={() => setShowProgramUpload(false)}
              title="Upload Programs"
              subtitle="Bulk import academic programs"
              columns={['program', 'duration']}
              onUpload={onUploadProgram}
              file={programFile}
              setFile={setProgramFile}
            />
          </div>
        )}

        {/* === BRANCH MANAGEMENT === */}
        {activeTab === 'branch-management' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Branch Management</h2>
            <p className="text-sm text-gray-600 mb-6">Upload branch data using Excel files. Download the template to see the required format.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={downloadBranchTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
              >
                <Download size={18} /> Download Template
              </button>
              <button 
                onClick={() => setShowBranchUpload(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
              >
                <Upload size={18} /> Upload Branches
              </button>
            </div>

            {uploadSuccess.show && uploadSuccess.type === 'Branches' && (
              <SuccessCard 
                uploadData={uploadSuccess} 
                onClose={() => setUploadSuccess({ show: false, type: '', fileName: '', fileSize: '', previewData: [] })}
              />
            )}

            <UploadModal
              isOpen={showBranchUpload}
              onClose={() => setShowBranchUpload(false)}
              title="Upload Branches"
              subtitle="Bulk import branches"
              columns={['program', 'branch', 'specialisation']}
              onUpload={onUploadBranch}
              file={branchFile}
              setFile={setBranchFile}
            />
          </div>
        )}

        {/* === HOD MANAGEMENT === */}
        {activeTab === 'hod-management' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">HOD Management</h2>
            <p className="text-sm text-gray-600 mb-6">Upload HOD data using Excel files. Download the template to see the required format.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={downloadHodTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
              >
                <Download size={18} /> Download Template
              </button>
              <button 
                onClick={() => setShowHodUpload(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
              >
                <Upload size={18} /> Upload HODs
              </button>
            </div>

            {uploadSuccess.show && uploadSuccess.type === 'HODs' && (
              <SuccessCard 
                uploadData={uploadSuccess} 
                onClose={() => setUploadSuccess({ show: false, type: '', fileName: '', fileSize: '', previewData: [] })}
              />
            )}

            <UploadModal
              isOpen={showHodUpload}
              onClose={() => setShowHodUpload(false)}
              title="Upload HODs"
              subtitle="Bulk import Head of Departments"
              columns={['name', 'email', 'branch', 'designation']}
              onUpload={onUploadHod}
              file={hodFile}
              setFile={setHodFile}
            />
          </div>
        )}

        {/* === STUDENT MANAGEMENT === */}
        {activeTab === 'student-management' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
             <h2 className="text-xl font-bold text-gray-800 mb-4">Student Management</h2>
             <p className="text-sm text-gray-600 mb-6">Upload student data using Excel files. Download the template to see the required format.</p>
             
             <div className="flex gap-3">
                <button 
                  onClick={downloadStudentTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                >
                  <Download size={18} /> Download Template
                </button>
                <button 
                  onClick={() => setShowStudentUpload(true)} 
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                >
                  <Upload size={18} /> Upload Students
                </button>
             </div>

             {uploadSuccess.show && uploadSuccess.type === 'Students' && (
               <SuccessCard 
                 uploadData={uploadSuccess} 
                 onClose={() => setUploadSuccess({ show: false, type: '', fileName: '', fileSize: '', previewData: [] })}
               />
             )}

             <UploadModal
                isOpen={showStudentUpload}
                onClose={() => setShowStudentUpload(false)}
                title="Upload Students"
                subtitle="Bulk import students"
                columns={['roll number', 'name', 'dob', 'branch', 'program', 'specialisation', 'batch', 'regulation']}
                onUpload={onUploadStudent}
                file={studentFile}
                setFile={setStudentFile}
             />
          </div>
        )}

        {/* === FACULTY MANAGEMENT === */}
        {activeTab === 'faculty-management' && (
           <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Faculty Management</h2>
              <p className="text-sm text-gray-600 mb-6">Upload faculty data using Excel files. Download the template to see the required format.</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={downloadFacultyTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                >
                  <Download size={18} /> Download Template
                </button>
                <button 
                  onClick={() => setShowFacultyUpload(true)} 
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                >
                  <Upload size={18} /> Upload Faculty
                </button>
              </div>

              {uploadSuccess.show && uploadSuccess.type === 'Faculty' && (
                <SuccessCard 
                  uploadData={uploadSuccess} 
                  onClose={() => setUploadSuccess({ show: false, type: '', fileName: '', fileSize: '', previewData: [] })}
                />
              )}

              <UploadModal
                isOpen={showFacultyUpload}
                onClose={() => setShowFacultyUpload(false)}
                title="Upload Faculty"
                subtitle="Bulk import faculty members"
                columns={['name', 'email', 'branch', 'designation']}
                onUpload={onUploadFaculty}
                file={facultyFile}
                setFile={setFacultyFile}
             />
           </div>
        )}

        {/* === SUBJECT MANAGEMENT === */}
        {activeTab === 'subject-management' && (
           <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Subject Management</h2>
              <p className="text-sm text-gray-600 mb-6">Upload subject data for specific regulations using Excel files. Download the template to see the required format.</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={downloadSubjectTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                >
                  <Download size={18} /> Download Template
                </button>
                <button 
                  onClick={() => setShowSubjectUpload(true)} 
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                >
                  <Upload size={18} /> Upload Subjects
                </button>
              </div>

              {uploadSuccess.show && uploadSuccess.type === 'Subjects' && (
                <SuccessCard 
                  uploadData={uploadSuccess} 
                  onClose={() => setUploadSuccess({ show: false, type: '', fileName: '', fileSize: '', previewData: [] })}
                />
              )}

              <UploadModal
                isOpen={showSubjectUpload}
                onClose={() => setShowSubjectUpload(false)}
                title="Upload Subjects"
                subtitle="Bulk import subjects for regulation"
                columns={['subject code', 'name', 'program', 'branch', 'regulation', 'year', 'semester', 'type']}
                onUpload={onUploadSubject}
                file={subjectFile}
                setFile={setSubjectFile}
             />
           </div>
        )}

        {/* === FEEDBACK MANAGEMENT === */}
        {activeTab === 'feedback-management' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Feedback Management</h2>
            
            {/* Subsection Selection - Show only if no subsection is selected */}
            {!feedbackSubsection && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Feedback Question Management Card */}
                <div 
                  onClick={() => setFeedbackSubsection('questions')}
                  className="group cursor-pointer p-8 bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-purple-500 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <FileText size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Feedback Question Management</h3>
                    <p className="text-sm text-gray-600">Manage feedback questions and evaluation criteria</p>
                  </div>
                </div>

                {/* Feedback Mapping Card */}
                <div 
                  onClick={() => setFeedbackSubsection('mapping')}
                  className="group cursor-pointer p-8 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-500 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <MapPin size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Feedback Mapping</h3>
                    <p className="text-sm text-gray-600">Map faculty with subjects for feedback collection</p>
                    {isPublished && (
                      <span className="mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Published
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Question Management Subsection */}
            {feedbackSubsection === 'questions' && (
              <div className="space-y-6">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setFeedbackSubsection(null)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                    >
                      <X size={18} /> Back
                    </button>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FileText size={20} className="text-purple-600" />
                      Feedback Question Management
                    </h3>
                  </div>
                  <button 
                    onClick={downloadFeedbackQuestionTemplate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                  >
                    <Download size={18} /> Download Template
                  </button>
                </div>

                {/* Add New Question */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Add New Question</h4>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Enter new feedback question or criteria"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button 
                      onClick={handleAddQuestion}
                      className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-semibold"
                    >
                      <Upload size={18} /> Add Question
                    </button>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Current Feedback Questions ({feedbackQuestions.length})</h4>
                  {feedbackQuestions.map((question) => (
                    <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-100 text-purple-700 font-bold rounded-lg px-3 py-1 text-sm min-w-[50px] text-center">
                          {question.sno}
                        </div>
                        {editingQuestion === question.id ? (
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              defaultValue={question.criteria}
                              id={`edit-${question.id}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                              onClick={() => {
                                const newCriteria = document.getElementById(`edit-${question.id}`).value
                                handleSaveQuestion(question.id, newCriteria)
                              }}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingQuestion(null)}
                              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="flex-1 text-gray-700">{question.criteria}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingQuestion(question.id)}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirmModal.show && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-in fade-in zoom-in-95">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 rounded-t-2xl">
                        <h3 className="text-xl font-bold text-white">Delete Question</h3>
                        <p className="text-sm text-red-100 mt-1">This action cannot be undone</p>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-gray-700 mb-4">Are you sure you want to delete this question?</p>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-gray-800 italic">"{deleteConfirmModal.questionText}"</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3 justify-end">
                        <button 
                          onClick={() => setDeleteConfirmModal({ show: false, questionId: null, questionText: '' })}
                          className="px-5 py-2.5 bg-white border-2 border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition-all font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmDeleteQuestion}
                          className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all font-medium shadow-lg"
                        >
                          Delete Question
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Feedback Mapping Subsection */}
            {feedbackSubsection === 'mapping' && (
              <div className="space-y-6">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setFeedbackSubsection(null)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                    >
                      <X size={18} /> Back
                    </button>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <MapPin size={20} className="text-blue-600" />
                      Feedback Mapping
                    </h3>
                    {isPublished && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Published
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={downloadFeedbackMappingTemplate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                  >
                    <Download size={18} /> Download Template
                  </button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">⚠️ Important:</span> Until mapping is published, HODs cannot see the timetable in their dashboard.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">ℹ️ Program Duration:</span> B.Tech (4 years), M.Tech (2 years), MBA (3 years), MCA (3 years)
                  </p>
                </div>

                {/* Mapping Form */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-4">Create New Mapping</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Program</label>
                      <select
                        value={mappingForm.program}
                        onChange={(e) => setMappingForm({ ...mappingForm, program: e.target.value, branch: '' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Program</option>
                        {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Batch Year (Start)</label>
                      <select
                        value={mappingForm.batchYear}
                        onChange={(e) => setMappingForm({ ...mappingForm, batchYear: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Year</option>
                        {batches.map(b => <option key={b.id} value={b.startYear}>{b.startYear}</option>)}
                      </select>
                      {mappingForm.program && mappingForm.batchYear && (
                        <p className="text-xs text-gray-600 mt-1">
                          End Year: {calculateEndYear(mappingForm.program, mappingForm.batchYear)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Branch</label>
                      <select
                        value={mappingForm.branch}
                        onChange={(e) => setMappingForm({ ...mappingForm, branch: e.target.value })}
                        disabled={!mappingForm.program}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        <option value="">Select Branch</option>
                        {branches.filter(b => b.programId === Number(mappingForm.program)).map(b => 
                          <option key={b.id} value={b.id}>{b.name}</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Year</label>
                      <select
                        value={mappingForm.year}
                        onChange={(e) => setMappingForm({ ...mappingForm, year: e.target.value })}
                        disabled={!mappingForm.program}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        <option value="">Select Year</option>
                        {mappingForm.program && (() => {
                          const program = programs.find(p => p.id === Number(mappingForm.program))
                          const duration = program?.duration || 4
                          const years = []
                          for (let i = 1; i <= duration; i++) {
                            const yearSuffix = i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'
                            years.push(<option key={i} value={`${i}${yearSuffix} year`}>{i}{yearSuffix} Year</option>)
                          }
                          return years
                        })()}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Semester</label>
                      <select
                        value={mappingForm.semester}
                        onChange={(e) => setMappingForm({ ...mappingForm, semester: e.target.value })}
                        disabled={!mappingForm.program}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        <option value="">Select Semester</option>
                        {mappingForm.program && (() => {
                          const program = programs.find(p => p.id === Number(mappingForm.program))
                          const duration = program?.duration || 4
                          const maxSemester = duration * 2
                          return Array.from({length: maxSemester}, (_, i) => i + 1).map(s => 
                            <option key={s} value={s}>{s}</option>
                          )
                        })()}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Subject</label>
                      <select
                        value={mappingForm.subject}
                        onChange={(e) => setMappingForm({ ...mappingForm, subject: e.target.value })}
                        disabled={!mappingForm.branch || !mappingForm.semester}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        <option value="">Select Subject</option>
                        {subjects
                          .filter(s => s.branchId === Number(mappingForm.branch) && s.semester === Number(mappingForm.semester))
                          .map(s => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Faculty</label>
                      <select
                        value={mappingForm.faculty}
                        onChange={(e) => setMappingForm({ ...mappingForm, faculty: e.target.value })}
                        disabled={!mappingForm.branch}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        <option value="">Select Faculty</option>
                        {faculty.filter(f => f.branchId === Number(mappingForm.branch)).map(f => 
                          <option key={f.id} value={f.id}>{f.facultyName}</option>
                        )}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={handleAddMapping}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-semibold"
                      >
                        Add Mapping
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mappings Table */}
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-4 border-b bg-gray-50">
                    <h4 className="font-semibold text-gray-800">Current Mappings ({feedbackMappings.length})</h4>
                  </div>
                  {feedbackMappings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Program</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Batch Year</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Branch</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sem</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Faculty</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feedbackMappings.map((mapping, idx) => (
                            <tr key={mapping.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-3 text-sm">{mapping.id}</td>
                              <td className="px-4 py-3 text-sm">{mapping.program}</td>
                              <td className="px-4 py-3 text-sm">{mapping.batchYear}</td>
                              <td className="px-4 py-3 text-sm">{mapping.branch}</td>
                              <td className="px-4 py-3 text-sm">{mapping.year}</td>
                              <td className="px-4 py-3 text-sm">{mapping.semester}</td>
                              <td className="px-4 py-3 text-sm">{mapping.subject}</td>
                              <td className="px-4 py-3 text-sm">{mapping.faculty}</td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleDeleteMapping(mapping.id)}
                                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition-all"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <MapPin size={40} className="mx-auto mb-3 opacity-20" />
                      <p>No mappings created yet. Add your first mapping above.</p>
                    </div>
                  )}
                </div>

                {/* Publish Button */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                  <button 
                    onClick={handlePublishMapping}
                    disabled={isPublished}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={20} /> {isPublished ? 'Already Published' : 'Publish Feedback Mapping'}
                  </button>
                  <p className="text-xs text-gray-600 mt-2">
                    {isPublished 
                      ? '✓ Mapping is published. HODs can view timetables.'
                      : '* Publishing will make the timetable visible to HODs in their dashboard'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminPage
