import { useState, useEffect, useMemo } from 'react';
import { patientService } from '../services/patient.service';
import type { Patient } from '../types/patient.type';

export const usePatientManager = () => {
  // State quản lý dữ liệu
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State quản lý tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm tải dữ liệu
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err) {
      console.error("Lỗi tải danh sách:", err);
      setError('Không thể tải danh sách bệnh nhân. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Tự động tải khi mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Logic lọc dữ liệu (Sử dụng useMemo để tối ưu hiệu năng)
  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      (p.hoVaTen?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (p.soDienThoai || '').includes(searchTerm)
    );
  }, [patients, searchTerm]);

  return {
    patients,
    filteredPatients,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refresh: fetchPatients
  };
};