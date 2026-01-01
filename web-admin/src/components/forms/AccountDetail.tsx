import React from 'react';
import { X, Mail, Phone, Home, Calendar, BadgeInfo, Briefcase } from 'lucide-react';

interface AccountDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: any;
  isLoading: boolean;
}

const AccountDetailModal: React.FC<AccountDetailModalProps> = ({ isOpen, onClose, account, isLoading }) => {
  if (!isOpen || !account) return null;

  // Helper render role riêng cho modal
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'BAC_SI': return 'Bác sĩ';
      case 'KY_THUAT_VIEN': return 'Kỹ thuật viên';
      default: return role;
    }
  };

  const bacSiInfo = account?.BacSi?.[0];
  const ktvInfo = account?.KyThuatVien?.[0];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 pt-10 relative text-center text-white">
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1 rounded-full">
            <X size={18} />
          </button>
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-lg">
            {account.hoVaTen.charAt(0)}
          </div>
          <h3 className="text-xl font-bold">{account.hoVaTen}</h3>
          <p className="opacity-80 text-sm">@{account.tenTaiKhoan} • {getRoleLabel(account.loaiTaiKhoan)}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Thông tin liên hệ */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin liên hệ</h4>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={18} className="text-blue-500" />
              <span className="text-gray-700 text-sm">{account.email || 'Chưa có'}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone size={18} className="text-green-500" />
              <span className="text-gray-700 text-sm">{account.soDienThoai || 'Chưa có'}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Home size={18} className="text-green-500" />
              <span className="text-gray-700 text-sm">{account.diaChi || 'Chưa có'}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar size={18} className="text-purple-500" />
              <span className="text-gray-700 text-sm">
                Tham gia: {new Date(account.ngayTaoTaiKhoan).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          {/* Thông tin chuyên môn */}
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin chuyên môn</h4>
            {isLoading ? (
              <p className="text-sm text-center italic text-gray-400">Đang tải...</p>
            ) : (
              <>
                {account.loaiTaiKhoan === 'BAC_SI' && bacSiInfo && (
                  <div className="p-3 bg-blue-50 rounded-lg text-sm space-y-1 border border-blue-100">
                    <p className="text-blue-800 font-semibold flex items-center gap-2">
                      <BadgeInfo size={14} /> Chuyên khoa: {bacSiInfo.chuyenKhoa}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Briefcase size={14} /> Công tác: {bacSiInfo.congTac}
                    </p>
                  </div>
                )}
                {account.loaiTaiKhoan === 'KY_THUAT_VIEN' && ktvInfo && (
                  <div className="p-3 bg-green-50 rounded-lg text-sm border border-green-100">
                    <p className="text-green-800 font-semibold flex items-center gap-2">
                      <BadgeInfo size={14} /> Chứng chỉ: {ktvInfo.chungChi}
                    </p>
                  </div>
                )}
                {account.loaiTaiKhoan === 'ADMIN' && (
                  <p className="text-sm text-gray-500 italic">Quản trị viên toàn quyền.</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100 text-sm">Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailModal;