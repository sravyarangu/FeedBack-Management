import api from './api';

const studentService = {
  // Get student profile
  getProfile: async () => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  // Get student's subjects for current semester
  getSubjects: async () => {
    const response = await api.get('/student/subjects');
    return response.data;
  },

  // Check if there's an active feedback window
  getFeedbackWindow: async () => {
    const response = await api.get('/student/feedback-window');
    return response.data;
  },

  // Get feedback questions
  getFeedbackQuestions: async () => {
    const response = await api.get('/student/feedback-questions');
    return response.data;
  },

  // Submit feedback for a subject
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/student/submit-feedback', feedbackData);
    return response.data;
  },

  // Check feedback submission status for a subject
  getFeedbackStatus: async (subjectMapId) => {
    const response = await api.get(`/student/feedback-status/${subjectMapId}`);
    return response.data;
  },

  // Get student's timetable
  getTimetable: async () => {
    const response = await api.get('/student/timetable');
    return response.data;
  },
};

export default studentService;
