import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const apodService = {
  getTodayApod: async () => {
    const response = await apiClient.get('/apod/today');
    return response.data;
  },

  getApodByDate: async (date) => {
    const response = await apiClient.get('/apod', {
      params: { date },
    });
    return response.data;
  },

  getRecentApods: async (count = 10) => {
    const response = await apiClient.get('/apod/recent', {
      params: { count },
    });
    return response.data;
  },
};

export default apodService;

