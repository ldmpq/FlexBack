import React from 'react';
import { UserPlus, Edit, Trash2, Eye, Shield, Briefcase, Stethoscope, UserCheck, Phone, Mail } from 'lucide-react';
import { useAccountManager } from '../hooks/useAccountManager';
import SearchBar from '../components/SearchBar';
import AccountDetailModal from '../components/forms/AccountDetail';
import AccountFormModal from '../components/forms/AccountForm';

const Accounts: React.FC = () => {
  const {
    filteredStaff, loading, searchTerm, setSearchTerm,
    showModal, setShowModal, showDetailModal, setShowDetailModal,
    selectedAccount, detailLoading,
    formData, setFormData, submitting, isEditing,
    handleViewDetail, handleSubmitAccount, handleDeleteAccount, openCreateModal, openEditModal
  } = useAccountManager();

  // Helper cho Role
  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'ADMIN': return { style: 'bg-red-100 text-red-700 border-red-200', icon: <Shield size={14} />, label: 'Quản trị viên' };
      case 'BAC_SI': return { style: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Stethoscope size={14} />, label: 'Bác sĩ' };
      case 'KY_THUAT_VIEN': return { style: 'bg-green-100 text-green-700 border-green-200', icon: <Briefcase size={14} />, label: 'Kỹ thuật viên' };
      default: return { style: 'bg-gray-100', icon: <UserCheck size={14} />, label: role };
    }
  };

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserCheck className="text-blue-600" /> Tài khoản Nội bộ
          </h2>
          <p className="text-gray-500 text-sm mt-1">Quản lý nhân sự ({filteredStaff.length})</p>
        </div>
        <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm transition">
          <UserPlus size={20} /> Tạo tài khoản mới
        </button>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Tìm kiếm tài khoản..." />

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {loading ? <div className="p-10 text-center text-blue-600">Đang tải...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="p-4">Nhân viên</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Liên hệ</th>
                  <th className="p-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStaff.map((staff) => {
                  const role = getRoleInfo(staff.loaiTaiKhoan);
                  return (
                    <tr key={staff.maTaiKhoan} className="hover:bg-blue-50/50 group">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {staff.hoVaTen.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{staff.hoVaTen}</p>
                          <p className="text-xs text-gray-500">@{staff.tenTaiKhoan}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold gap-1 border ${role.style}`}>
                          {role.icon} {role.label}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1"><Phone size={12} /> {staff.soDienThoai || '--'}</span>
                          <span className="flex items-center gap-1"><Mail size={12} /> {staff.email || '--'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleViewDetail(staff)} className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100" title="Xem chi tiết">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => openEditModal(staff)} className="p-2 text-green-600 bg-green-50 rounded hover:bg-green-100" title="Sửa">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteAccount(staff.maTaiKhoan, staff.hoVaTen)} className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100" title="Xóa">
                            <Trash2 size={16} />
                          </button>
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

      <AccountDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        account={selectedAccount}
        isLoading={detailLoading}
      />

      <AccountFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEditing={isEditing}
        isSelfEdit={false}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitAccount}
        submitting={submitting}
      />
    </div>
  );
};

export default Accounts;