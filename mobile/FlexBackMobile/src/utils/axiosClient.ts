import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Uncomment khi cài thư viện này

const baseURL = 'http://10.0.2.2:3000/api'; 

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Biến lưu token tạm thời (nếu chưa dùng AsyncStorage)
export let authToken = ''; 

export const setAuthToken = (token: string) => {
  authToken = token;
};

// Interceptor: Tự động gắn Token vào mọi request
axiosClient.interceptors.request.use(
  async (config) => {
    // const token = await AsyncStorage.getItem('token'); // Cách chuẩn dùng AsyncStorage
    const token = authToken; // Cách tạm thời dùng biến global

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;