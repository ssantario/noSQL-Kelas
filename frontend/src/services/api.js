import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // adjust this port to match your backend port
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor for handling tokens if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api };
