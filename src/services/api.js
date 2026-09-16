import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('job_seek_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    // Auto logout on token expiration
    if (error.response?.status === 401 && localStorage.getItem('job_seek_token')) {
      // Don't auto-redirect if on login or signup
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        localStorage.removeItem('job_seek_token');
        localStorage.removeItem('job_seek_user');
      }
    }

    return Promise.reject(new Error(message));
  }
);

// Auth endpoints
export const authApi = {
  login: (credentials) => api.post('/api/login', credentials),
  signup: (userData) => api.post('/api/signup', userData),
  getMe: () => api.get('/api/me'),
};

// Jobs endpoints
export const jobsApi = {
  getAll: (params) => api.get('/api/jobs', { params }),
  getEmployerJobs: (employerName) => api.get('/api/emp/jobs', { params: { employerName } }),
  createJob: (jobData) => api.post('/api/create-job', jobData),
  removeJob: (data) => api.delete('/api/jobs/remove', { data }),
  getApplicantCount: (jobName) => api.get(`/api/jobs/${encodeURIComponent(jobName)}/applicants`),
};

// Applicant endpoints
export const applicantsApi = {
  apply: (applicationData) => api.post('/api/applicants/apply', applicationData),
  getSeekerApplications: (userName) => api.get('/api/applicants', { params: { userName } }),
  getEmployerApplicants: (employerName) => api.get('/api/employer/applicants', { params: { employerName } }),
  getEmployerJobSeekers: (employerName) => api.get('/api/employers/jobseekers', { params: { employerName } }),
  getApprovedApplications: (employerName) => api.get('/api/approved-applications', { params: { employerName } }),
  approveApplication: (data) => api.post('/api/approve-application', data),
  removeApplication: (data) => api.delete('/api/applicants/remove', { data }),
  removeWithNotification: (data) => api.post('/api/remove-application', data),
};

// Notifications endpoints
export const notifApi = {
  getUserNotifications: (username) => api.get(`/api/notifications/${encodeURIComponent(username)}`),
  sendNotification: (data) => api.post('/api/notifications/send', data),
  removeNotification: (data) => api.delete('/api/notifications/remove', { data }),
};

// Resume endpoints
export const resumeApi = {
  uploadResume: (formData, userName) =>
    api.post(`/api/upload-resume?userName=${encodeURIComponent(userName)}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  downloadResume: async (userName) => {
    const response = await api.get(`/api/fetch-resume/${encodeURIComponent(userName)}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${userName}_resume.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default api;
