import React, { useState } from 'react';
import axiosClient from '../utils/axiosClient';
import physioIllustration from '../assets/FlexBack_banner.jpg';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res: any = await axiosClient.post('/auth/login', {
        tenTaiKhoan: username,
        matKhau: password,
      });

      const { user, token } = res;
      const allowedRoles = ['BAC_SI', 'ADMIN', 'KY_THUAT_VIEN'];

      if (!allowedRoles.includes(user.loaiTaiKhoan)) {
        setError('Tài khoản này là Bệnh nhân, vui lòng dùng Mobile App!');
        return;
      }

      localStorage.setItem('access_token', token);
      localStorage.setItem('user_info', JSON.stringify(user));

      window.location.href = '/admin';
    } catch (err: any) {
      console.error('LOGIN ERROR:', err);
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <div className="hidden md:flex w-1/2 bg-white items-center justify-center p-10 relative">
        <div className="w-full max-w-xl">
           <img 
             src={physioIllustration} 
             alt="Physiotherapy Illustration" 
             className="w-full h-auto object-contain"
           />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-blue-500 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute -bottom-24 -right-24 w-80 h-80 border-[3px] border-white/20 rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 border-[3px] border-white/20 rounded-full pointer-events-none"></div>

        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">FLEXBACK</h1>
            <p className="text-gray-500 text-xs">Hệ thống quản lí ứng dụng hỗ trợ phục hồi chức năng</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-xs rounded-r">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm placeholder-gray-400 transition-colors"
                placeholder="Tên tài khoản / Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm placeholder-gray-400 transition-colors"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-lg transform transition hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Đang xử lý...' : 'Login'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;