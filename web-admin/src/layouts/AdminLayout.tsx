import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, FileText, LogOut, User, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserInfo {
  hoVaTen: string;
  loaiTaiKhoan: string;
}

const AdminLayout = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('user_info');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const MenuItem = ({ to, icon: Icon, label }: any) => {
    const active = location.pathname === to || location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`flex items-center p-3 rounded mb-2 ${
          active ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
        }`}
      >
        <Icon size={20} className="mr-3" />
        {label}
      </Link>
    );
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-white shadow flex flex-col">
        <div className="p-6 border-b text-center font-bold text-blue-600">
          FLEXBACK
        </div>

        <div className="p-4 border-b bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-200 p-2 rounded-full">
              <User size={24} className="text-blue-700" />
            </div>

            <div>
              <p className="text-xs text-blue-600">Xin chào {user?.loaiTaiKhoan}</p>
              <p className="font-bold text-gray-800">
                {user?.hoVaTen || 'Admin'}
              </p>
            </div>
          </div>
        </div>


        <nav className="p-4 flex-1">
          <MenuItem to="/admin" icon={LayoutDashboard} label="Tổng quan" />
          <MenuItem to="/admin/patients" icon={Users} label="Bệnh nhân" />
          <MenuItem to="/admin/plans" icon={FileText} label="Hồ sơ và Lộ trình" />
          <MenuItem to="/admin/exercises" icon={Activity} label="Kho Bài tập" />
          {/* Phân quyền hiển thị mục Tài khoản Nội bộ */} 
          {user?.loaiTaiKhoan === 'ADMIN' && (
            <MenuItem to="/admin/accounts" icon={UserCheck} label="Tài khoản Nội bộ" />
          )}         
        </nav>

        <button onClick={logout} className="p-4 flex items-center text-red-500 hover:bg-red-50" >
          <LogOut size={18} className="mr-2" /> Đăng xuất
        </button>
      </aside>

      <main className="flex-1 overflow-auto p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
