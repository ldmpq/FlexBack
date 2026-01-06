import axios from 'axios';

const baseURL = 'http://10.0.2.2:3000/api'; 

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Biến lưu token tạm thời
export let authToken = ''; 

export const setAuthToken = (token: string) => {
  authToken = token;
};

// Interceptor: Tự động gắn Token vào mọi request
axiosClient.interceptors.request.use(
  async (config) => {
    const token = authToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;