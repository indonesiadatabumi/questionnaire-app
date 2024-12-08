import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.100.254:20608', // Replace with your API base URL
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
