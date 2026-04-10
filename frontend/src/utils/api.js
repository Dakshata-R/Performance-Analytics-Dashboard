import axios from 'axios';

const API = axios.create({
  baseURL: 'https://performance-analytics-dashboard.onrender.com/api'
});

// Attach token from localStorage before every request
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('pi_user');

  if (user) {
    const { token } = JSON.parse(user);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
