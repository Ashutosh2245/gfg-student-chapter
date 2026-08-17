import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gfg_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  createMember: (memberData) => api.post('/auth/create-member', memberData),
  forgotPassword: (emailData) => api.post('/auth/forgot-password', emailData),
  resetPassword: (resetData) => api.post('/auth/reset-password', resetData)
};

export const usersAPI = {
  getMembers: (params) => api.get('/users', { params }),
  getMemberById: (id) => api.get(`/users/${id}`),
  updateStatus: (id, is_active) => api.patch(`/users/${id}/status`, { is_active }),
  updateMember: (id, memberData) => api.put(`/users/${id}`, memberData),
  deleteMember: (id) => api.delete(`/users/${id}`),
  updateOwnProfile: (profileData) => api.patch('/users/profile/update', profileData)
};

export const departmentsAPI = {
  getDepartments: () => api.get('/departments'),
  getDepartmentBySlug: (slug) => api.get(`/departments/${slug}`)
};

export const tasksAPI = {
  getTasks: (params) => api.get('/tasks', { params }),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  submitTask: (id, submissionData) => api.post(`/tasks/${id}/submit`, submissionData),
  reviewTask: (id, reviewData) => api.post(`/tasks/${id}/review`, reviewData)
};

export const leaderboardAPI = {
  getLeaderboard: (params) => api.get('/leaderboard', { params }),
  awardXP: (xpData) => api.post('/leaderboard/award-xp', xpData)
};

export const eventsAPI = {
  getEvents: () => api.get('/events'),
  createEvent: (eventData) => api.post('/events', eventData)
};

export default api;
