import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, User, UserCheck, ChevronDown, Settings, Eye, Dumbbell, Database, BicepsFlexed, ClipboardList, Map, Pill, Utensils, CalendarCheck } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import AccountDetailModal from '../components/forms/AccountDetail';
import AccountFormModal from '../components/forms/AccountForm';
import axiosClient from '../utils/axiosClient';

interface UserInfo {
  hoVaTen: string;
  loaiTaiKhoan: string;
}

const AdminLayout = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const location = useLocation();

  // --- States cho Dropdown & Modals ---
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandGeneral, setExpandGeneral] = useState(false);
  
  // State xem chi tiết
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [fullProfile, setFullProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // State cập nhật thông tin
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  // Ref để click ra ngoài thì đóng menu
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user_info');
    if (stored) setUser(JSON.parse(stored));

    // Event listener click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // 1. Hàm lấy data từ API (Dùng chung cho cả Xem và Sửa)
  const fetchMyProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await axiosClient.get('/auth/me');
      return res.data.data || res.data;
    } catch (error) {
      console.error("Lỗi tải thông tin:", error);
      return null;
    } finally {
      setLoadingProfile(false);
    }
  };

  // 2. Xử lý click "Xem chi tiết"
  const handleOpenDetail = async () => {
    setShowDropdown(false); // Đóng menu
    setShowProfileModal(true);
    const data = await fetchMyProfile();
    if (data) setFullProfile(data);
  };

  // 3. Xử lý click "Cập nhật thông tin"
  const handleOpenEdit = async () => {
    setShowDropdown(false); // Đóng menu
    setShowEditModal(true);
    const data = await fetchMyProfile();
    
    if (data) {
      // Map dữ liệu vào form
      setEditFormData({
        hoVaTen: data.hoVaTen,
        tenTaiKhoan: data.tenTaiKhoan,
        email: data.email || '',
        soDienThoai: data.soDienThoai || '',
        loaiTaiKhoan: data.loaiTaiKhoan,
        matKhau: '',
        xacNhanMatKhau: ''
      });
    }
  };

  // 4. Xử lý Submit form cập nhật
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData.matKhau && editFormData.matKhau !== editFormData.xacNhanMatKhau) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setSubmitting(true);
      await axiosClient.put('/auth/update-profile', editFormData); 
      
      alert("Cập nhật thành công!");
      setShowEditModal(false);
      
      // Cập nhật lại tên hiển thị ở Sidebar nếu có đổi tên
      const updatedUser = { ...user, hoVaTen: editFormData.hoVaTen };
      setUser(updatedUser as UserInfo);
      localStorage.setItem('user_info', JSON.stringify(updatedUser));

    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật thông tin.");
    } finally {
      setSubmitting(false);
    }
  };

  const MenuItem = ({ to, icon: Icon, label }: any) => {
    const active = to === '/admin' 
      ? location.pathname === to 
      : location.pathname.startsWith(to);
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
      <aside className="w-64 bg-white shadow flex flex-col z-20">
        <div className="p-6 border-b text-center font-bold text-blue-600">
          FLEXBACK
        </div>

        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`p-4 border-b cursor-pointer transition-colors flex items-center justify-between ${showDropdown ? 'bg-blue-100' : 'bg-blue-50 hover:bg-blue-100'}`}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-200 p-2 rounded-full">
                <User size={24} className="text-blue-700" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-blue-600">Xin chào {user?.loaiTaiKhoan}</p>
                <p className="font-bold text-gray-800 truncate w-28">
                  {user?.hoVaTen || 'Admin'}
                </p>
              </div>
            </div>
            <ChevronDown size={16} className={`text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </div>

          {showDropdown && (
            <div className="absolute top-full left-2 right-2 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 fade-in z-50">
              <button 
                onClick={handleOpenDetail}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors border-b border-gray-50"
              >
                <Eye size={16} className="text-blue-500" />
                Xem chi tiết
              </button>
              <button 
                onClick={handleOpenEdit}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
              >
                <Settings size={16} className="text-green-500" />
                Cập nhật thông tin
              </button>
            </div>
          )}
        </div>

        <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
          <MenuItem to="/admin" icon={LayoutDashboard} label="Tổng quan" />
          <MenuItem to="/admin/patients" icon={Users} label="Bệnh nhân" />
          <MenuItem to="/admin/plans" icon={Map} label="Hồ sơ và Lộ trình" />
          <MenuItem to="/admin/reports" icon={ClipboardList} label="Báo cáo" />
          {user?.loaiTaiKhoan === 'KY_THUAT_VIEN' && (
             <div className="mt-2">
                <MenuItem to="/admin/assignments" icon={CalendarCheck} label="Phân công" />
             </div>
          )}

          <div>
            <button 
              onClick={() => setExpandGeneral(!expandGeneral)}
              className={`w-full flex items-center justify-between p-3 rounded-lg mb-1 transition-colors duration-200 ${expandGeneral ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center">
                <Database size={20} className={`mr-3 ${expandGeneral ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium">Quản lí chung</span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${expandGeneral ? 'rotate-180' : ''}`} />
            </button>

            {/* Sub-menu Items */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandGeneral ? 'max-h-50 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="ml-4 pl-3 border-l-2 border-gray-100 my-1 space-y-1">
                <MenuItem to="/admin/muscles" icon={BicepsFlexed} label="Nhóm cơ" />
                <MenuItem to="/admin/exercises" icon={Dumbbell} label="Kho Bài tập" />
                <MenuItem icon={Pill} label="Kho Thuốc" />
                <MenuItem icon={Utensils} label="Kho Thực phẩm" />
              </div>
            </div>
          </div>
          
          {user?.loaiTaiKhoan === 'ADMIN' && (
             <div className="mt-2">
                <MenuItem to="/admin/accounts" icon={UserCheck} label="Tài khoản Nội bộ" />
             </div>
          )}         
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="group flex w-full items-center gap-3 px-4 py-3 text-gray-500 font-medium hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
            <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-white group-hover:text-red-500 transition-colors shadow-sm">
              <LogOut size={18} />
            </div>
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8 bg-gray-50">
        <Outlet />
      </main>

      <AccountDetailModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        account={fullProfile}
        isLoading={loadingProfile}
      />

      <AccountFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        isEditing={true}
        formData={editFormData}
        setFormData={setEditFormData}
        onSubmit={handleUpdateSubmit}
        submitting={submitting}
      />
    </div>
  );
};

export default AdminLayout;