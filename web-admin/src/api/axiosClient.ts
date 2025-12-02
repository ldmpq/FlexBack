import axios from 'axios';

// URL của Backend Node.js (đang chạy port 3000)
// Lưu ý: Nếu sau này deploy lên server thật thì sửa link này lại
const baseURL = 'http://localhost:3000/api';

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor 1: Gửi Token đi kèm
// Tự động chèn Token vào Header mỗi khi gọi API
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor 2: Xử lý phản hồi
// Giúp code gọn hơn: trả về data trực tiếp thay vì response.data
axiosClient.interceptors.response.use((response) => {
  if (response && response.data) {
    return response.data; 
  }
  return response;
}, (error) => {
  // Nếu lỗi 401 (Hết hạn token) -> Tự động đá ra trang Login
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    window.location.href = '/login';
  }
  
  throw error;
});

export default axiosClient;