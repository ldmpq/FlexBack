import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { patientDetailService } from '../services/patientDetail.service';
import type { PatientDetailData, DoctorOption, CreateHoSoForm } from '../types/patientDetail.type';

export const usePatientDetailManager = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
  
  // Data State
  const [patient, setPatient] = useState<PatientDetailData | null>(null);
  const [listBacSi, setListBacSi] = useState<DoctorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(false);

  // UI & Form State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateHoSoForm>({
    chanDoan: '',
    trangThaiHienTai: '',
    maBacSi: ''
  });

  // --- API CALLS ---
  
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
      // Chỉ gọi API nếu list đang rỗng để tiết kiệm request
      if (listBacSi.length === 0) {
        setDoctorsLoading(true); // Bắt đầu loading
        const data = await patientDetailService.getDoctors();
        setListBacSi(data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách bác sĩ:", error);
    } finally {
      setDoctorsLoading(false); // Kết thúc loading
    }
  };

  // Load data khi component mount hoặc ID thay đổi
  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // --- HANDLERS ---

  const handleCreateHoSo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.chanDoan) return alert("Vui lòng nhập chẩn đoán!");

    // Lấy maBenhNhan từ dữ liệu chi tiết đã load
    const maBenhNhan = patient?.BenhNhan?.[0]?.maBenhNhan;
    if (!maBenhNhan) {
      return alert("Lỗi dữ liệu bệnh nhân (Thiếu mã chi tiết). Vui lòng tải lại trang.");
    }

    try {
      setSubmitting(true);
      await patientDetailService.createHoSo({
        maBenhNhan,
        maBacSi: formData.maBacSi,
        chanDoan: formData.chanDoan,
        trangThaiHienTai: formData.trangThaiHienTai
      });

      alert("Tạo hồ sơ thành công!");
      setShowModal(false);
      setFormData({ chanDoan: '', trangThaiHienTai: '', maBacSi: '' }); // Reset form
      fetchDetail(); // Reload lại dữ liệu mới nhất
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tạo hồ sơ.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helpers để mở modal và load bác sĩ cùng lúc
  const openCreateModal = () => {
    setShowModal(true);
    fetchDoctors();
  };

  return {
    patient, loading, listBacSi, doctorsLoading, // Export thêm doctorsLoading
    showModal, setShowModal, 
    formData, setFormData, submitting,
    handleCreateHoSo, openCreateModal
  };
};