import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Calendar, FileText, PlusCircle, Edit } from 'lucide-react';
import { usePatientDetailManager } from '../hooks/usePatientDetailManager';
import CreateRecordForm from '../components/forms/CreateRecordForm';

const PatientDetail: React.FC = () => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user_info') || '{}');
  const isDoctor = currentUser?.loaiTaiKhoan === 'BAC_SI';

  const { 
    patient, loading, listBacSi, listKTV, doctorsLoading,
    showModal, setShowModal,
    formData, setFormData, submitting,
    editingId,
    handleSaveHoSo, openCreateModal, openEditModal
  } = usePatientDetailManager();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang điều trị': return 'bg-green-100 text-green-700 border-green-200';
      case 'Hoàn thành': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Tạm hoãn': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Đã hủy': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (loading) return <div className="p-8 text-center text-blue-600 font-medium">Đang tải thông tin...</div>;
  if (!patient) return <div className="p-8 text-center text-red-500">Không tìm thấy bệnh nhân! (Vui lòng kiểm tra lại ID)</div>;

  const info = patient.BenhNhan;

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans text-gray-800 relative">
      <button onClick={() => navigate('/admin/patients')} className="flex items-center text-gray-500 hover:text-blue-600 mb-4 transition">
        <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách
      </button>

      {/* HEADER THÔNG TIN */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col md:flex-row gap-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl shrink-0">
          {patient.hoVaTen ? patient.hoVaTen.charAt(0) : 'U'}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{patient.hoVaTen}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <p className="flex items-center"><User size={18} className="mr-2" /> {patient.gioiTinh} - {patient.ngaySinh ? new Date(patient.ngaySinh).toLocaleDateString('vi-VN') : '---'}</p>
            <p className="flex items-center"><Phone size={18} className="mr-2" /> {patient.soDienThoai}</p>
            <p className="flex items-center"><MapPin size={18} className="mr-2" /> {patient.diaChi || 'Chưa cập nhật'}</p>
            
            <p className="flex items-center font-medium text-blue-600">
              Chiều cao: {info?.chieuCao || '--'}cm - Cân nặng: {info?.canNang || '--'}kg
            </p>
          </div>
        </div>
        <div className="border-l pl-6 border-gray-100 min-w-[300px]">
           <h3 className="font-bold text-gray-700 mb-2">Tình trạng hiện tại của bệnh nhân:</h3>
           <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded italic">
             "{info?.tinhTrangHienTai || 'Chưa có ghi chú tình trạng'}"
           </p>
        </div>
      </div>

      {/* DANH SÁCH HỒ SƠ */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FileText className="mr-2 text-blue-600" /> Hồ sơ bệnh án
        </h2>

        {isDoctor && (
          <button 
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow"
          >
            <PlusCircle size={18} /> Tạo hồ sơ mới
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {info?.HoSoBenhAn && info.HoSoBenhAn.length > 0 ? (
          info.HoSoBenhAn.map((hs) => (
            <div key={hs.maHoSo} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition cursor-pointer relative group">
              
              {/* Header Card Hồ sơ */}
              <div className="flex justify-between mb-2">
                <span className="font-bold text-lg text-blue-700">Hồ sơ #{hs.maHoSo}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded border shadow-sm ${getStatusColor(hs.trangThaiHienTai || '')}`}>
                    {hs.trangThaiHienTai || 'Đang điều trị'}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center pl-2 border-l border-gray-200">
                    <Calendar size={14} className="mr-1" />
                    {new Date(hs.ngayLapHoSo).toLocaleDateString('vi-VN')}
                  </span>

                  {isDoctor && (
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditModal(hs); }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition opacity-0 group-hover:opacity-100"
                      title="Chỉnh sửa hồ sơ"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Nội dung hồ sơ */}
              <p className="text-gray-700 font-medium mb-1">Chẩn đoán: {hs.chanDoan}</p>
              
              <p className="text-sm text-gray-500">
                Bác sĩ phụ trách: <span className="font-semibold">
                  {hs.BacSi?.TaiKhoan?.hoVaTen || hs.BacSi?.hoVaTen || 'Chưa phân công'}
                </span>
              </p>

              <p className="text-sm text-gray-500 mt-1">
                KTV phụ trách: <span className="font-semibold text-blue-600">
                  {hs.PhanCong && hs.PhanCong.length > 0
                    ? hs.PhanCong[0].KyThuatVien?.TaiKhoan?.hoVaTen
                    : 'Chưa phân công'}
                </span>
              </p>
              
              {/* Nút xem lộ trình */}
              <div className="mt-4 pt-3 border-t flex justify-end gap-3">
                 <button 
                    onClick={() => navigate('/admin/plans', { state: { selectedHoSoId: hs.maHoSo } })}
                    className="text-sm text-blue-600 font-medium hover:underline flex items-center"
                 >
                    Xem lộ trình điều trị &rarr;
                 </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            Bệnh nhân này chưa có hồ sơ bệnh án nào. Hãy tạo hồ sơ đầu tiên!
          </div>
        )}
      </div>

      {isDoctor && (
        <CreateRecordForm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSaveHoSo}
          formData={formData}
          setFormData={setFormData}
          submitting={submitting}
          listBacSi={listBacSi}
          listKTV={listKTV}
          doctorsLoading={doctorsLoading}
          title={editingId ? "Cập nhật hồ sơ" : "Tạo hồ sơ mới"}
        />)}
    </div>
  );
};

export default PatientDetail;