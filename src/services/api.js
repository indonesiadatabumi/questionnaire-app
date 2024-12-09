import axios from 'axios';

const API = axios.create({
  baseURL: `http://192.168.1.254:20608`,
  // baseURL: `http://66.96.229.251:20608`,
});

// Add Authorization header for protected routes
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
