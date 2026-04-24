import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export type CurrentRole = 'USER' | 'ADMIN' | 'TECHNICIAN' | 'STAFF';

export const getCurrentUser = () => {
  const userId = localStorage.getItem('smartCampusUserId') || '1';
  const role = (localStorage.getItem('smartCampusUserRole') || 'USER') as CurrentRole;
  const userName = localStorage.getItem('smartCampusUserName') || 'Demo User';
  return { userId, role, userName };
};

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const { userId, role, userName } = getCurrentUser();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-User-Id'] = userId;
  config.headers['X-User-Role'] = role;
  config.headers['X-User-Name'] = userName;
  return config;
});

export default apiClient;
