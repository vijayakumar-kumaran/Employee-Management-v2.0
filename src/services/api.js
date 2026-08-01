import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT Auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User & Auth APIs
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const registerUser = (userData) => api.post('/users/register', userData);
export const signupUserWithEmployee = (data) => api.post('/users/signup', data);
export const getUserProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/update-profile', data);
export const getUserById = (id) => api.get(`/users/user/${id}`);

// Employee APIs
export const fetchAllEmployees = () => api.get('/employees/all');
export const fetchEmployeeById = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post('/employees', data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
export const searchEmployees = (params) => api.get('/employees/search', { params });
export const fetchEmployeeRoleUsers = () => api.get('/employees/role');
export const fetchAdminRoleUsers = () => api.get('/employees/role/admin');
export const getUserIdByEmployeeId = (empId) => api.get(`/employees/userid/${empId}`);

// Task APIs
export const fetchAllTasks = (params) => api.get('/tasks', { params });
export const fetchAdminTasks = (adminId) => api.get(`/tasks/admin/${adminId}`);
export const fetchEmployeeTasks = (employeeId) => api.get(`/tasks/employee/${employeeId}`);
export const fetchTodayTasks = () => api.get('/tasks/today');
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const updateTaskExtended = (id, data) => api.put(`/tasks/update/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Leave APIs
export const requestLeave = (data) => api.post('/leaves/request', data);
export const fetchAllLeaves = () => api.get('/leaves/all');
export const updateLeaveStatus = (id, data) => api.put(`/leaves/update/${id}`, data);
export const fetchLeaveHistory = (employeeId, filter) => api.get(`/leaves/history/${employeeId}`, { params: { filter } });
export const fetchEmployeeLeaves = (employeeId) => api.get(`/leaves/employee/${employeeId}`);

// Notification APIs
export const fetchUserNotifications = (userId) => api.get(`/notifications/task/${userId}`);
export const markNotificationAsRead = (id) => api.put(`/notifications/markAsRead/${id}`);
export const clearAllNotifications = (userId) => api.put(`/notifications/clearAll/${userId}`);

// Attendance APIs
export const checkInAttendance = (data) => api.post('/attendance/check-in', data);
export const checkOutAttendance = (data) => api.post('/attendance/check-out', data);
export const getAttendanceStatus = (employeeId) => api.get(`/attendance/status/${employeeId}`);
export const getAttendanceHistory = (employeeId) => api.get(`/attendance/history/${employeeId}`);
export const getTodayAttendanceSummary = () => api.get('/attendance/today-summary');

// Organization APIs
export const fetchOrgChart = () => api.get('/organization/org-chart');
export const fetchAnnouncements = () => api.get('/organization/announcements');
export const createAnnouncement = (data) => api.post('/organization/announcements', data);
export const fetchDepartmentSummary = () => api.get('/organization/departments-summary');

export default api;
