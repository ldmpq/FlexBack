import React from 'react';
import { Search, Eye, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/forms/SearchBar';
import { usePatientManager } from '../hooks/usePatientManager';

const Patients: React.FC = () => {
  const navigate = useNavigate();
  // Lấy toàn bộ logic từ Hook
  const {
    filteredPatients,
    loading,
    error,
    searchTerm,
    setSearchTerm
  } = usePatientManager();

  return (
    <div className="p-6 font-sans text-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <User className="text-blue-600" /> Quản lí Bệnh nhân
        </h2>
          <p className="text-gray-500">Danh sách bệnh nhân đang điều trị trong hệ thống</p>
        </div>
      </div>
      {/* --- SEARCH BAR --- */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Tìm kiếm theo tên bệnh nhân hoặc số điện thoại..."
      />
      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 rounded-r shadow-sm">
          <p className="font-medium">Đã xảy ra lỗi!</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {/* --- TABLE DANH SÁCH --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Họ và Tên</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Liên hệ</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Giới tính / Ngày sinh</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tình trạng</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                  <tr key={patient.maTaiKhoan} className="hover:bg-blue-50 transition duration-150 group">
                    {/* Cột 1: Tên & Mã */}
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 border border-blue-200">
                          {patient.hoVaTen ? patient.hoVaTen.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{patient.hoVaTen || 'Chưa cập nhật tên'}</p>
                          <p className="text-xs text-gray-500 font-mono">#{patient.maTaiKhoan}</p>
                        </div>
                      </div>
                    </td>
                    {/* Cột 2: Liên hệ */}
                    <td className="p-4">
                      <p className="text-sm text-gray-700 font-medium">{patient.soDienThoai || '---'}</p>
                      <p className="text-xs text-gray-500">{patient.email}</p>
                    </td>
                    {/* Cột 3: Giới tính & Tuổi */}
                    <td className="p-4">
                      <div className="text-sm text-gray-700">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${patient.gioiTinh === 'Nam' ? 'bg-blue-100 text-blue-700' :
                            patient.gioiTinh === 'Nữ' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                          {patient.gioiTinh}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {patient.ngaySinh ? new Date(patient.ngaySinh).toLocaleDateString('vi-VN') : '---'}
                      </p>
                    </td>
                    {/* Cột 4: Tình trạng (Lấy từ bảng BenhNhan) */}
                    <td className="p-4">
                      <p className="text-sm text-gray-600 max-w-xs truncate" title={patient.BenhNhan?.[0]?.tinhTrangHienTai}>
                        {patient.BenhNhan?.[0]?.tinhTrangHienTai || <span className="text-gray-400 italic">Chưa có hồ sơ</span>}
                      </p>
                    </td>
                    {/* Cột 5: Hành động */}
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/patients/${patient.maTaiKhoan}`)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition shadow-sm border border-blue-100"
                          title="Xem chi tiết" > <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                      <Search size={48} className="text-gray-200 mb-4 opacity-50" />
                      <p className="text-lg font-medium">Không tìm thấy bệnh nhân nào.</p>
                      <p className="text-sm text-gray-400">Thử tìm kiếm với từ khóa khác.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;