import axios from 'axios';

// URL Backend (port 3000)
const baseURL = 'http://localhost:3000/api';

const axiosClient = axios.create({
  baseURL: baseURL,
});

// Interceptor 1: Tự động gắn Token vào headers
axiosClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access_token');

    // Gắn token nếu có
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor 2: Xử lý response
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (error) => {
    // Token hết hạn → logout
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
