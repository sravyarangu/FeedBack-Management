import api from './api';

const principalService = {
  // Get principal profile
  getProfile: async () => {
    const response = await api.get('/principal/profile');
    return response.data;
  },

  // Get all feedback windows across the institution
  getFeedbackWindows: async () => {
    const response = await api.get('/principal/feedback-windows');
    return response.data;
  },

  // Get institution-wide analytics
  getAnalytics: async (params) => {
    const response = await api.get('/principal/analytics', { params });
    return response.data;
  },

  // Get overall statistics
  getStatistics: async () => {
    const response = await api.get('/principal/statistics');
    return response.data;
  },

  // View all programs
  getPrograms: async () => {
    const response = await api.get('/principal/programs');
    return response.data;
  },

  // View all batches
  getBatches: async () => {
    const response = await api.get('/principal/batches');
    return response.data;
  },

  // View all students
  getStudents: async (params) => {
    const response = await api.get('/principal/students', { params });
    return response.data;
  },

  // View all faculty
  getFaculty: async (params) => {
    const response = await api.get('/principal/faculty', { params });
    return response.data;
  },

  // View all subjects
  getSubjects: async (params) => {
    const response = await api.get('/principal/subjects', { params });
    return response.data;
  },

  // Get department-wise statistics
  getDepartmentStatistics: async () => {
    const response = await api.get('/principal/department-statistics');
    return response.data;
  },

  // Get feedback trends
  getFeedbackTrends: async (params) => {
    const response = await api.get('/principal/feedback-trends', { params });
    return response.data;
  },
};

export default principalService;
