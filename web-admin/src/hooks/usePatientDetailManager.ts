import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { patientDetailService } from '../services/patientDetail.service';
import type { PatientDetailData, DoctorOption, KtvOption, CreateHoSoForm } from '../types/patientDetail.type';

export const usePatientDetailManager = () => {
  const { id } = useParams<{ id: string }>(); 
  
  // --- Data State ---
  const [patient, setPatient] = useState<PatientDetailData | null>(null);
  const [listBacSi, setListBacSi] = useState<DoctorOption[]>([]);
  const [listKTV, setListKTV] = useState<KtvOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [ktvsLoading, setKtvsLoading] = useState(false);

  // --- UI & Form State ---
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // State quan trọng: Đang sửa ID nào? (null = Tạo mới)
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateHoSoForm>({
    chanDoan: '',
    trangThaiHienTai: '',
    maBacSi: '',
    maKyThuatVien: ''
  });

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await patientDetailService.getPatientDetail(id);
      setPatient(data);
    } catch (error) {
      console.error("Lỗi tải thông tin chi tiết:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchDoctors = async () => {
    try {
      if (listBacSi.length === 0) {
        setDoctorsLoading(true);
        const data = await patientDetailService.getDoctors();
        setListBacSi(data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách bác sĩ:", error);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const fetchKTVs = async () => {
    try {
      if (listKTV.length === 0) {
        setKtvsLoading(true);
        const data = await patientDetailService.getKTVs(); 
        setListKTV(data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách KTV:", error);
    } finally {
      setKtvsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    fetchDoctors();
    fetchKTVs();
  }, [fetchDetail]);


  // 1. Mở Modal Tạo Mới
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ chanDoan: '', trangThaiHienTai: 'Đang điều trị', maBacSi: '', maKyThuatVien: '' }); // Reset Form
    setShowModal(true);
  };

  // 2. Mở Modal Chỉnh Sửa (Đổ dữ liệu cũ vào form)
  const openEditModal = (record: any) => {
    setEditingId(record.maHoSo); // Set ID đang sửa
    
    // Tìm KTV hiện tại trong mảng Phân công
    const currentKTV = record.PhanCong && record.PhanCong.length > 0 
      ? record.PhanCong[0].maKyThuatVien 
      : '';

    setFormData({
      chanDoan: record.chanDoan || '',
      // Lấy trạng thái từ bệnh nhân hoặc hồ sơ
      trangThaiHienTai: record.trangThaiHienTai || 'Đang điều trị', 
      maBacSi: record.maBacSi || '',
      maKyThuatVien: currentKTV
    });

    setShowModal(true);
  };

  // 3. Xử lý Lưu (Tự động phân biệt Tạo/Sửa)
  const handleSaveHoSo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.chanDoan) return alert("Vui lòng nhập chẩn đoán!");

    const maBenhNhan = patient?.BenhNhan?.maBenhNhan;
    if (!maBenhNhan) return alert("Lỗi dữ liệu bệnh nhân (Thiếu mã chi tiết).");

    try {
      setSubmitting(true);

      if (editingId) {
        await patientDetailService.updateHoSo(editingId, {
          ...formData,
          // Update không cần gửi lại maBenhNhan
        });
        alert("Cập nhật hồ sơ thành công!");
      } else {
        await patientDetailService.createHoSo({
          maBenhNhan,
          maBacSi: formData.maBacSi,
          maKyThuatVien: formData.maKyThuatVien,
          chanDoan: formData.chanDoan,
          trangThaiHienTai: formData.trangThaiHienTai
        });
        alert("Tạo hồ sơ thành công!");
      }

      setShowModal(false);
      setEditingId(null);
      fetchDetail(); // Load lại dữ liệu mới nhất
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    patient, loading, listBacSi, listKTV, doctorsLoading, ktvsLoading,
    showModal, setShowModal, 
    formData, setFormData, submitting,
    editingId,
    openCreateModal,
    openEditModal,
    handleSaveHoSo,
    fetchDetail
  };
};