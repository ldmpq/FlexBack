import React, { useState } from 'react';
import { UserPlus, Search, Edit, Trash2, X, Save, UserCheck, Stethoscope, Briefcase, Eye, EyeOff, Shield, BadgeInfo, Phone, Mail, Calendar } from 'lucide-react';
import { useAccountManager } from '../hooks/useAccountManager';
import SearchBar from '../components/forms/SearchBar';

const Accounts: React.FC = () => {
  // Lấy toàn bộ logic và state từ Hook
  const {
    filteredStaff, loading, searchTerm, setSearchTerm,
    showModal, setShowModal, showDetailModal, setShowDetailModal,
    selectedAccount, detailLoading,
    formData, setFormData, submitting, isEditing,
    handleViewDetail, handleSubmitAccount, handleDeleteAccount, openCreateModal, openEditModal
  } = useAccountManager();

  const [showPassword, setShowPassword] = useState(false); // UI state cục bộ

  // Hàm render helper cho Role
  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'ADMIN': return { style: 'bg-red-100 text-red-700 border-red-200', icon: <Shield size={14}/>, label: 'Quản trị viên' };
      case 'BAC_SI': return { style: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Stethoscope size={14}/>, label: 'Bác sĩ' };
      case 'KY_THUAT_VIEN': return { style: 'bg-green-100 text-green-700 border-green-200', icon: <Briefcase size={14}/>, label: 'Kỹ thuật viên' };
      default: return { style: 'bg-gray-100', icon: <UserCheck size={14}/>, label: role };
    }
  };

  const bacSiInfo = selectedAccount?.BacSi?.[0];
  const ktvInfo = selectedAccount?.KyThuatVien?.[0];

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><UserCheck className="text-blue-600"/> Tài khoản Nội bộ</h2>
          <p className="text-gray-500 text-sm">Quản lý nhân sự ({filteredStaff.length})</p>
        </div>
        <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm transition">
          <UserPlus size={20} /> Tạo mới
        </button>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Tìm kiếm tài khoản..."
      />

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {loading ? <div className="p-10 text-center text-blue-600">Đang tải...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                <tr><th className="p-4">Nhân viên</th><th className="p-4">Vai trò</th><th className="p-4">Liên hệ</th><th className="p-4 text-center">Thao tác</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStaff.map((staff) => {
                  const role = getRoleInfo(staff.loaiTaiKhoan);
                  return (
                    <tr key={staff.maTaiKhoan} className="hover:bg-blue-50/50 group">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">{staff.hoVaTen.charAt(0)}</div>
                        <div><p className="font-bold text-gray-800">{staff.hoVaTen}</p><p className="text-xs text-gray-500">@{staff.tenTaiKhoan}</p></div>
                      </td>
                      <td className="p-4"><span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold gap-1 border ${role.style}`}>{role.icon} {role.label}</span></td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex flex-col gap-1">
                           <span className="flex items-center gap-1"><Phone size={12}/> {staff.soDienThoai || '--'}</span>
                           <span className="flex items-center gap-1"><Mail size={12}/> {staff.email || '--'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleViewDetail(staff)} className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"><Eye size={16}/></button>
                          <button onClick={() => openEditModal(staff)} className="p-2 text-green-600 bg-green-50 rounded hover:bg-green-100"><Edit size={16}/></button>
                          <button onClick={() => handleDeleteAccount(staff.maTaiKhoan, staff.hoVaTen)} className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL CHI TIẾT --- */}
      {showDetailModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 pt-10 relative text-center text-white">
              <button onClick={() => setShowDetailModal(false)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1 rounded-full"><X size={18}/></button>
              <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-lg">
                {selectedAccount.hoVaTen.charAt(0)}
              </div>
              <h3 className="text-xl font-bold">{selectedAccount.hoVaTen}</h3>
              <p className="opacity-80 text-sm">@{selectedAccount.tenTaiKhoan} • {getRoleInfo(selectedAccount.loaiTaiKhoan).label}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin liên hệ</h4>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><Mail size={18} className="text-blue-500"/><span className="text-gray-700 text-sm">{selectedAccount.email || 'Chưa có'}</span></div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><Phone size={18} className="text-green-500"/><span className="text-gray-700 text-sm">{selectedAccount.soDienThoai || 'Chưa có'}</span></div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><Calendar size={18} className="text-purple-500"/><span className="text-gray-700 text-sm">Tham gia: {new Date(selectedAccount.ngayTaoTaiKhoan).toLocaleDateString('vi-VN')}</span></div>
              </div>

              <div className="space-y-3 pt-2 border-t">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin chuyên môn</h4>
                {detailLoading ? <p className="text-sm text-center italic text-gray-400">Đang tải...</p> : (
                  <>
                    {selectedAccount.loaiTaiKhoan === 'BAC_SI' && bacSiInfo && (
                      <div className="p-3 bg-blue-50 rounded-lg text-sm space-y-1 border border-blue-100">
                        <p className="text-blue-800 font-semibold flex items-center gap-2"><BadgeInfo size={14}/> Chuyên khoa: {bacSiInfo.chuyenKhoa}</p>
                        <p className="text-gray-600 flex items-center gap-2"><Briefcase size={14}/> Công tác: {bacSiInfo.congTac}</p>
                      </div>
                    )}
                    {selectedAccount.loaiTaiKhoan === 'KY_THUAT_VIEN' && ktvInfo && (
                      <div className="p-3 bg-green-50 rounded-lg text-sm border border-green-100">
                        <p className="text-green-800 font-semibold flex items-center gap-2"><BadgeInfo size={14}/> Chứng chỉ: {ktvInfo.chungChi}</p>
                      </div>
                    )}
                    {selectedAccount.loaiTaiKhoan === 'ADMIN' && <p className="text-sm text-gray-500 italic">Quản trị viên toàn quyền.</p>}
                  </>
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end"><button onClick={() => setShowDetailModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100 text-sm">Đóng</button></div>
          </div>
        </div>
      )}

      {/* --- MODAL TẠO / SỬA --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in">
            <div className={`p-4 text-white flex justify-between items-center ${isEditing ? 'bg-green-600' : 'bg-blue-600'}`}>
              <h3 className="font-bold flex items-center gap-2">{isEditing ? <Edit size={18}/> : <UserCheck size={18}/>} {isEditing ? 'Cập nhật' : 'Tạo mới'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmitAccount} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vai trò</label>
                <select className="w-full border p-2 rounded" value={formData.loaiTaiKhoan} onChange={e => setFormData({...formData, loaiTaiKhoan: e.target.value as any})}>
                  <option value="BAC_SI">Bác sĩ</option><option value="KY_THUAT_VIEN">Kỹ thuật viên</option><option value="ADMIN">Quản trị viên</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Họ tên *</label><input required className="w-full border p-2 rounded" value={formData.hoVaTen} onChange={e => setFormData({...formData, hoVaTen: e.target.value})}/></div>
                <div><label className="block text-sm font-medium mb-1">Username *</label><input required disabled={isEditing} className={`w-full border p-2 rounded ${isEditing && 'bg-gray-100'}`} value={formData.tenTaiKhoan} onChange={e => setFormData({...formData, tenTaiKhoan: e.target.value})}/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" className="w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/></div>
                <div><label className="block text-sm font-medium mb-1">SĐT</label><input className="w-full border p-2 rounded" value={formData.soDienThoai} onChange={e => setFormData({...formData, soDienThoai: e.target.value})}/></div>
              </div>
              <div className="bg-gray-50 p-3 rounded border">
                <label className="block text-sm font-medium mb-1">Mật khẩu {isEditing ? '(Bỏ qua nếu không đổi)' : '*'}</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} className="w-full border p-2 rounded pr-10" value={formData.matKhau} onChange={e => setFormData({...formData, matKhau: e.target.value})}/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2.5 text-gray-400">{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                </div>
                {formData.matKhau && <input type="password" placeholder="Nhập lại mật khẩu..." className="w-full border p-2 rounded mt-2" value={formData.xacNhanMatKhau} onChange={e => setFormData({...formData, xacNhanMatKhau: e.target.value})}/>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Hủy</button>
                <button type="submit" disabled={submitting} className={`px-4 py-2 text-white rounded ${isEditing ? 'bg-green-600' : 'bg-blue-600'}`}>{submitting ? '...' : 'Lưu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;