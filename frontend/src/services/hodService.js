import api from './api';

const hodService = {
  // Get HOD profile
  getProfile: async () => {
    const response = await api.get('/hod/profile');
    return response.data;
  },

  // Get batches in HOD's department
  getBatches: async () => {
    const response = await api.get('/hod/batches');
    return response.data;
  },

  // Get students for a specific batch year
  getBatchStudents: async (year) => {
    const response = await api.get(`/hod/batch/${year}/students`);
    return response.data;
  },

  // Get subjects in HOD's department
  getSubjects: async () => {
    const response = await api.get('/hod/subjects');
    return response.data;
  },

  // Get all faculty in the department
  getFaculty: async () => {
    const response = await api.get('/hod/faculty');
    return response.data;
  },

  // Get subject-faculty mapping
  getSubjectMapping: async () => {
    const response = await api.get('/hod/subject-mapping');
    return response.data;
  },

  // Get feedback windows
  getFeedbackWindows: async () => {
    const response = await api.get('/hod/feedback-windows');
    return response.data;
  },

  // Publish a new feedback window
  publishFeedbackWindow: async (windowData) => {
    const response = await api.post('/hod/feedback-window/publish', windowData);
    return response.data;
  },

  // Close a feedback window
  closeFeedbackWindow: async (windowId) => {
    const response = await api.patch(`/hod/feedback-window/${windowId}/close`);
    return response.data;
  },

  // Get feedback analytics
  getAnalytics: async (params) => {
    const response = await api.get('/hod/analytics', { params });
    return response.data;
  },

  // Get department statistics
  getStatistics: async () => {
    const response = await api.get('/hod/statistics');
    return response.data;
  },

  // Get timetable for a batch
  getTimetable: async (batchId) => {
    const response = await api.get(`/hod/timetable/${batchId}`);
    return response.data;
  },
};

export default hodService;
