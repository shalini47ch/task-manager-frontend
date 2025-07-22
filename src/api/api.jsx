import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8080',
  baseURL:"https://task-manager-backend-1-1j9f.onrender.com/"
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
