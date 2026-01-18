import api from './api';

const adminService = {
  // ========== Programs ==========
  getPrograms: async () => {
    const response = await api.get('/admin/programs');
    return response.data;
  },

  createProgram: async (programData) => {
    const response = await api.post('/admin/programs', programData);
    return response.data;
  },

  updateProgram: async (programId, programData) => {
    const response = await api.put(`/admin/programs/${programId}`, programData);
    return response.data;
  },

  deleteProgram: async (programId) => {
    const response = await api.delete(`/admin/programs/${programId}`);
    return response.data;
  },

  // ========== Batches ==========
  getBatches: async () => {
    const response = await api.get('/admin/batches');
    return response.data;
  },

  createBatch: async (batchData) => {
    const response = await api.post('/admin/batches', batchData);
    return response.data;
  },

  updateBatch: async (batchId, batchData) => {
    const response = await api.put(`/admin/batches/${batchId}`, batchData);
    return response.data;
  },

  deleteBatch: async (batchId) => {
    const response = await api.delete(`/admin/batches/${batchId}`);
    return response.data;
  },

  // ========== Students ==========
  getStudents: async (params) => {
    const response = await api.get('/admin/students', { params });
    return response.data;
  },

  createStudent: async (studentData) => {
    const response = await api.post('/admin/students', studentData);
    return response.data;
  },

  updateStudent: async (studentId, studentData) => {
    const response = await api.put(`/admin/students/${studentId}`, studentData);
    return response.data;
  },

  deleteStudent: async (studentId) => {
    const response = await api.delete(`/admin/students/${studentId}`);
    return response.data;
  },

  bulkUploadStudents: async (data) => {
    const response = await api.post('/admin/students/bulk', data);
    return response.data;
  },

  // ========== Bulk Uploads ==========
  bulkUploadBatches: async (data) => {
    const response = await api.post('/admin/batches/bulk', data);
    return response.data;
  },

  bulkUploadPrograms: async (data) => {
    const response = await api.post('/admin/programs/bulk', data);
    return response.data;
  },

  bulkUploadHODs: async (data) => {
    const response = await api.post('/admin/hods/bulk', data);
    return response.data;
  },

  bulkUploadFaculty: async (data) => {
    const response = await api.post('/admin/faculty/bulk', data);
    return response.data;
  },

  bulkUploadSubjects: async (data) => {
    const response = await api.post('/admin/subjects/bulk', data);
    return response.data;
  },

  bulkUploadBranches: async (data) => {
    const response = await api.post('/admin/branches/bulk', data);
    return response.data;
  },

  // ========== Faculty ==========
  getFaculty: async (params) => {
    const response = await api.get('/admin/faculty', { params });
    return response.data;
  },

  createFaculty: async (facultyData) => {
    const response = await api.post('/admin/faculty', facultyData);
    return response.data;
  },

  updateFaculty: async (facultyId, facultyData) => {
    const response = await api.put(`/admin/faculty/${facultyId}`, facultyData);
    return response.data;
  },

  deleteFaculty: async (facultyId) => {
    const response = await api.delete(`/admin/faculty/${facultyId}`);
    return response.data;
  },

  // ========== Subjects ==========
  getSubjects: async (params) => {
    const response = await api.get('/admin/subjects', { params });
    return response.data;
  },

  createSubject: async (subjectData) => {
    const response = await api.post('/admin/subjects', subjectData);
    return response.data;
  },

  updateSubject: async (subjectId, subjectData) => {
    const response = await api.put(`/admin/subjects/${subjectId}`, subjectData);
    return response.data;
  },

  deleteSubject: async (subjectId) => {
    const response = await api.delete(`/admin/subjects/${subjectId}`);
    return response.data;
  },

  // ========== HODs ==========
  getHODs: async () => {
    const response = await api.get('/admin/hods');
    return response.data;
  },

  createHOD: async (hodData) => {
    const response = await api.post('/admin/hods', hodData);
    return response.data;
  },

  updateHOD: async (hodId, hodData) => {
    const response = await api.put(`/admin/hods/${hodId}`, hodData);
    return response.data;
  },

  deleteHOD: async (hodId) => {
    const response = await api.delete(`/admin/hods/${hodId}`);
    return response.data;
  },

  // ========== Subject Mapping ==========
  getSubjectMappings: async (params) => {
    const response = await api.get('/admin/subject-mapping', { params });
    return response.data;
  },

  createSubjectMapping: async (mappingData) => {
    const response = await api.post('/admin/subject-mapping', mappingData);
    return response.data;
  },

  updateSubjectMapping: async (mappingId, mappingData) => {
    const response = await api.put(`/admin/subject-mapping/${mappingId}`, mappingData);
    return response.data;
  },

  deleteSubjectMapping: async (mappingId) => {
    const response = await api.delete(`/admin/subject-mapping/${mappingId}`);
    return response.data;
  },

  bulkUploadSubjectMappings: async (formData) => {
    const response = await api.post('/admin/subject-mapping/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ========== Analytics ==========
  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  // ========== Feedback Questions ==========
  getFeedbackQuestions: async () => {
    const response = await api.get('/admin/feedback-questions');
    return response.data;
  },

  updateFeedbackQuestions: async (questions) => {
    const response = await api.put('/admin/feedback-questions', { questions });
    return response.data;
  },

  // ========== Download Templates ==========
  downloadTemplate: async (type) => {
    const response = await api.get(`/admin/template/${type}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Set filename based on type
    const fileNames = {
      'batch': 'Batch_Upload_Template.xlsx',
      'program': 'Program_Upload_Template.xlsx',
      'branch': 'Branch_Upload_Template.xlsx',
      'hod': 'HOD_Upload_Template.xlsx',
      'student': 'Student_Upload_Template.xlsx',
      'faculty': 'Faculty_Upload_Template.xlsx',
      'subject': 'Subject_Upload_Template.xlsx'
    };
    
    link.setAttribute('download', fileNames[type] || 'Template.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  },
};

export default adminService;
