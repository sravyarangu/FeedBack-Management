import api from './api';

const authService = {
  // Student login
  studentLogin: async (rollNo, dob) => {
    const response = await api.post('/auth/student/login', { rollNo, dob });
    return response.data;
  },

  // HOD login
  hodLogin: async (email, password) => {
    const response = await api.post('/auth/hod/login', { email, password });
    return response.data;
  },

  // Admin login
  adminLogin: async (email, password) => {
    const response = await api.post('/auth/admin/login', { email, password });
    return response.data;
  },

  // Principal login
  principalLogin: async (email, password) => {
    const response = await api.post('/auth/principal/login', { email, password });
    return response.data;
  },

  // Vice Principal login
  vicePrincipalLogin: async (email, password) => {
    const response = await api.post('/auth/vice-principal/login', { email, password });
    return response.data;
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  // Change password for student
  studentChangePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/student/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Change password for HOD
  hodChangePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/hod/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Change password for admin
  adminChangePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/admin/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email, role) => {
    const response = await api.post(`/auth/${role}/forgot-password`, { email });
    return response.data;
  },
};

export default authService;
