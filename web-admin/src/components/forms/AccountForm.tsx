import React, { useState } from 'react';
import { X, Edit, UserCheck, Eye, EyeOff, Stethoscope, Award } from 'lucide-react';

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  isSelfEdit?: boolean;
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({
  isOpen, onClose, isEditing, formData, setFormData, onSubmit, submitting, isSelfEdit
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;
  
  const showSpecializedFields = !isEditing || isSelfEdit;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* --- HEADER --- */}
        <div className={`p-4 text-white flex justify-between items-center shrink-0 ${isEditing ? 'bg-green-600' : 'bg-blue-600'}`}>
          <h3 className="font-bold flex items-center gap-2 text-lg">
            {isEditing ? <Edit size={20} /> : <UserCheck size={20} />}
            {isEditing ? 'Cập nhật tài khoản' : 'Tạo tài khoản mới'}
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X size={20} /></button>
        </div>

        {/* --- BODY (Scrollable) --- */}
        <div className="overflow-y-auto p-6">
          <form id="accountForm" onSubmit={onSubmit} className="space-y-5">
            
            {/* 1. Chọn Vai trò (Bị khóa nếu đang Edit) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Vai trò {isEditing && <span className="text-red-500 font-normal text-xs ml-1">(Không thể thay đổi)</span>}
              </label>
              <div className="relative">
                <select
                  disabled={isEditing}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none appearance-none transition-all
                    ${isEditing 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
                      : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                    }`}
                  value={formData.loaiTaiKhoan}
                  onChange={e => setFormData({ ...formData, loaiTaiKhoan: e.target.value })}
                >
                  <option value="BAC_SI">Bác sĩ</option>
                  <option value="KY_THUAT_VIEN">Kỹ thuật viên</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>

                {!isEditing && (
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Form Nhập liệu BÁC SĨ */}
            {formData.loaiTaiKhoan === 'BAC_SI' && showSpecializedFields && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold text-xs uppercase tracking-wider">
                  <Stethoscope size={14} className="stroke-2"/> Thông tin chuyên môn
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Chuyên khoa</label>
                    <input
                      className="w-full border border-blue-200 p-2.5 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                      placeholder="VD: Chấn thương chỉnh hình"
                      value={formData.chuyenKhoa || ''}
                      onChange={e => setFormData({ ...formData, chuyenKhoa: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Đơn vị công tác</label>
                    <input
                      className="w-full border border-blue-200 p-2.5 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                      placeholder="VD: Khoa Ngoại..."
                      value={formData.congTac || ''}
                      onChange={e => setFormData({ ...formData, congTac: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Form Nhập liệu KỸ THUẬT VIÊN */}
            {formData.loaiTaiKhoan === 'KY_THUAT_VIEN' && showSpecializedFields && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="flex items-center gap-2 mb-3 text-green-800 font-bold text-xs uppercase tracking-wider">
                  <Award size={14} className="stroke-2"/> Thông tin chứng chỉ
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Chứng chỉ / Bằng cấp</label>
                  <input
                    className="w-full border border-green-200 p-2.5 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white"
                    placeholder="VD: Chứng chỉ Vật lý trị liệu..."
                    value={formData.chungChi || ''}
                    onChange={e => setFormData({ ...formData, chungChi: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* 4. Thông tin chung */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                <input
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Nhập họ và tên..."
                  value={formData.hoVaTen}
                  onChange={e => setFormData({ ...formData, hoVaTen: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username <span className="text-red-500">*</span></label>
                <input
                  required
                  disabled={isEditing}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none transition-all
                    ${isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'}`}
                  placeholder="Tên đăng nhập..."
                  value={formData.tenTaiKhoan}
                  onChange={e => setFormData({ ...formData, tenTaiKhoan: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số điện thoại</label>
                <input
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="09xx..."
                  value={formData.soDienThoai}
                  onChange={e => setFormData({ ...formData, soDienThoai: e.target.value })}
                />
              </div>
            </div>

            {/* 5. Mật khẩu */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mật khẩu {isEditing ? <span className="text-gray-400 font-normal text-xs">(Để trống nếu không đổi)</span> : <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                  placeholder={isEditing ? "********" : "Nhập mật khẩu..."}
                  value={formData.matKhau}
                  onChange={e => setFormData({ ...formData, matKhau: e.target.value })}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Nhập lại mật khẩu (Chỉ hiện khi đã nhập mật khẩu) */}
              {formData.matKhau && (
                <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu để xác nhận..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.xacNhanMatKhau}
                    onChange={e => setFormData({ ...formData, xacNhanMatKhau: e.target.value })}
                  />
                </div>
              )}
            </div>
          </form>
        </div>

        {/* --- FOOTER --- */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="accountForm"
            disabled={submitting}
            className={`px-6 py-2.5 text-white rounded-lg font-medium shadow-md shadow-blue-100 flex items-center gap-2 transition-all active:scale-95
              ${isEditing 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
              } 
              ${submitting ? 'opacity-70 cursor-wait' : ''}`
            }
          >
            {submitting ? 'Đang lưu...' : (isEditing ? 'Lưu thay đổi' : 'Tạo tài khoản')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AccountFormModal;