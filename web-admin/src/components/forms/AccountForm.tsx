import React, { useState } from 'react';
import { X, Edit, UserCheck, Eye, EyeOff } from 'lucide-react';

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({
  isOpen, onClose, isEditing, formData, setFormData, onSubmit, submitting
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in">
        {/* Header */}
        <div className={`p-4 text-white flex justify-between items-center ${isEditing ? 'bg-green-600' : 'bg-blue-600'}`}>
          <h3 className="font-bold flex items-center gap-2">
            {isEditing ? <Edit size={18} /> : <UserCheck size={18} />}
            {isEditing ? 'Cập nhật tài khoản' : 'Tạo tài khoản mới'}
          </h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vai trò</label>
            <select
              className="w-full border p-2 rounded"
              value={formData.loaiTaiKhoan}
              onChange={e => setFormData({ ...formData, loaiTaiKhoan: e.target.value })}
            >
              <option value="BAC_SI">Bác sĩ</option>
              <option value="KY_THUAT_VIEN">Kỹ thuật viên</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ tên *</label>
              <input
                required
                className="w-full border p-2 rounded"
                value={formData.hoVaTen}
                onChange={e => setFormData({ ...formData, hoVaTen: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username *</label>
              <input
                required
                disabled={isEditing}
                className={`w-full border p-2 rounded ${isEditing && 'bg-gray-100'}`}
                value={formData.tenTaiKhoan}
                onChange={e => setFormData({ ...formData, tenTaiKhoan: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border p-2 rounded"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input
                className="w-full border p-2 rounded"
                value={formData.soDienThoai}
                onChange={e => setFormData({ ...formData, soDienThoai: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded border">
            <label className="block text-sm font-medium mb-1">
              Mật khẩu {isEditing ? '(Bỏ qua nếu không đổi)' : '*'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border p-2 rounded pr-10"
                value={formData.matKhau}
                onChange={e => setFormData({ ...formData, matKhau: e.target.value })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2.5 text-gray-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formData.matKhau && (
              <input
                type="password"
                placeholder="Nhập lại mật khẩu..."
                className="w-full border p-2 rounded mt-2"
                value={formData.xacNhanMatKhau}
                onChange={e => setFormData({ ...formData, xacNhanMatKhau: e.target.value })}
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Hủy</button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 text-white rounded ${isEditing ? 'bg-green-600' : 'bg-blue-600'}`}
            >
              {submitting ? '...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountFormModal;