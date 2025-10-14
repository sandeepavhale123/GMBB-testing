import axios from 'axios';

// Create a separate axios instance for public API calls without authentication
export const publicAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.gmbbriefcase.com/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple response interceptor for error handling (no auth logic)
publicAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error('Public API Error:', error);
    return Promise.reject(error);
  }
);