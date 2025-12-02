import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import axiosClient from './api/axiosClient';
import { LayoutDashboard, Users, Activity, FileText, LogOut, User as UserIcon } from 'lucide-react';

import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Exercises from './pages/Exercises';
import TreatmentManager from './pages/TreatmentManager';

// 1. DEFINING TYPES (Định nghĩa kiểu dữ liệu chuẩn TypeScript)
// Kiểu dữ liệu cho User (khớp với response từ Backend)
interface User {
  maTaiKhoan: number;
  tenTaiKhoan: string;
  hoVaTen: string;
  loaiTaiKhoan: string; // 'BAC_SI' | 'QUAN_TRI' | 'KY_THUAT_VIEN'
  avatar?: string;
}

// Kiểu dữ liệu trả về khi Login thành công
interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

// 2. COMPONENTS
// Trang Đăng nhập
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Gọi API: TypeScript sẽ hiểu res là LoginResponse nhờ axios interceptor (hoặc ép kiểu ở đây)
      const res = await axiosClient.post<LoginResponse>('/auth/login', {
        tenTaiKhoan: username,
        matKhau: password
      });
      
      // Vì axiosClient trả về data trực tiếp, ta cần ép kiểu (casting)
      const data = res as unknown as LoginResponse;

      // Chỉ cho phép Bác sĩ hoặc KTV đăng nhập vào Web
      const allowedRoles = ['BAC_SI', 'QUAN_TRI', 'KY_THUAT_VIEN'];
      if (!allowedRoles.includes(data.user.loaiTaiKhoan)) {
        setError('Tài khoản này là Bệnh nhân, vui lòng dùng Mobile App!');
        setIsLoading(false);
        return;
      }

      // Lưu thông tin
      localStorage.setItem('access_token', data.token);
      localStorage.setItem('user_info', JSON.stringify(data.user));
      
      // Chuyển hướng (Reload để cập nhật state App)
      window.location.href = '/admin';
    } catch (err: any) {
      // Xử lý lỗi từ backend gửi về
      const msg = err.response?.data?.message || 'Đăng nhập thất bại!';
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">FLEXBACK</h1>
          <p className="text-gray-500 mt-2">Hệ thống quản lý ứng dụng phục hồi chức năng</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Tài khoản</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="Nhập tên tài khoản..."
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Mật khẩu</label>
            <input 
              type="password" 
              required
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="Nhập mật khẩu..."
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Layout Admin (Sidebar + Header + Content)
const AdminLayout: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage khi component mount
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    window.location.href = '/login';
  };

  // Helper để active menu item
  const MenuItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = window.location.pathname === href;
    return (
      <a 
        href={href} 
        className={`flex items-center p-3 mb-2 rounded transition-colors ${
          isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Icon size={20} className="mr-3" /> 
        {label}
      </a>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col z-10">
        <div className="p-6 border-b flex items-center justify-center">
          <h2 className="text-2xl font-bold text-blue-600 tracking-wider">FLEXBACK</h2>
        </div>
        
        <div className="p-6 border-b bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-200 p-2 rounded-full">
              <UserIcon size={24} className="text-blue-700"/>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Xin chào {user?.loaiTaiKhoan?.replace('_', ' ') || 'Doctor'}</p>
              <p className="font-bold text-gray-800 text-sm">{user?.hoVaTen || 'Admin'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <MenuItem href="/admin" icon={LayoutDashboard} label="Tổng quan" />
          <MenuItem href="/admin/patients" icon={Users} label="Bệnh nhân" />
          <MenuItem href="/admin/plans" icon={FileText} label="Hồ sơ & Lộ trình" />
          <MenuItem href="/admin/exercises" icon={Activity} label="Kho Bài tập" />
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <LogOut size={20} className="mr-3" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

// Trang Dashboard mẫu
const Dashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tổng quan hệ thống</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
          <div>
            <h3 className="text-gray-500 text-sm font-medium uppercase">Bệnh nhân</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">12</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Users size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 flex justify-between items-center">
          <div>
            <h3 className="text-gray-500 text-sm font-medium uppercase">Bài tập hôm nay</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">5</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <Activity size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500 flex justify-between items-center">
          <div>
            <h3 className="text-gray-500 text-sm font-medium uppercase">Báo cáo mới</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">3</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
            <FileText size={24} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">Hoạt động gần đây</h3>
        <div className="text-center py-10 text-gray-500 italic">
          Chưa có dữ liệu hoạt động nào...
        </div>
      </div>
    </div>
  );
};

// 3. MAIN ROUTER
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route công khai */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Route cần đăng nhập (Protected Routes) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientDetail />} />

          <Route path="plans" element={<TreatmentManager/>} />

          <Route path="exercises" element={<Exercises />} />
        </Route>

        {/* Redirect mặc định */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;