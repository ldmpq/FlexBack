import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Calendar, FileText, PlusCircle} from 'lucide-react';
import { usePatientDetailManager } from '../hooks/usePatientDetailManager';
import CreateRecordForm from '../components/forms/CreateRecordForm';

const PatientDetail: React.FC = () => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user_info') || '{}');
  const isDoctor = currentUser?.loaiTaiKhoan === 'BAC_SI';

  // Lấy logic từ Hook
  const { 
    patient, loading, listBacSi, listKTV, doctorsLoading,
    showModal, setShowModal,
    formData, setFormData, submitting,
    handleCreateHoSo, openCreateModal
  } = usePatientDetailManager();

  if (loading) return <div className="p-8 text-center text-blue-600 font-medium">Đang tải thông tin...</div>;
  if (!patient) return <div className="p-8 text-center text-red-500">Không tìm thấy bệnh nhân! (Vui lòng kiểm tra lại ID)</div>;

  // Sử dụng Optional Chaining để tránh lỗi khi data chưa đầy đủ
  const info = patient.BenhNhan;

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans text-gray-800 relative">
      {/* Nút quay lại */}
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
           <h3 className="font-bold text-gray-700 mb-2">Tình trạng hiện tại:</h3>
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
            <div key={hs.maHoSo} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition cursor-pointer">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-lg text-blue-700">Hồ sơ #{hs.maHoSo}</span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {new Date(hs.ngayLapHoSo).toLocaleDateString('vi-VN')}
                </span>
              </div>
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
              
              {/* NÚT XEM LỘ TRÌNH*/}
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

      {/* TẠO HỒ SƠ */}
      {isDoctor && (
        <CreateRecordForm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateHoSo}
          formData={formData}
          setFormData={setFormData}
          submitting={submitting}
          listBacSi={listBacSi}
          listKTV={listKTV}
          doctorsLoading={doctorsLoading}
        />)}
    </div>
  );
};

export default PatientDetail;
