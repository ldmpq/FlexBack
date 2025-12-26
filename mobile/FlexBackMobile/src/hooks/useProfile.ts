import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { profileService } from '../services/profile.service';

export const useProfile = () => {
  const [formData, setFormData] = useState({
    // User info
    hoVaTen: '',
    email: '',
    soDienThoai: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    diaChi: '',
    // Medical profile
    chieuCao: '',
    canNang: '',
    tienSuChanThuong: '',
    tinhTrangHienTai: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load profile
  const fetchProfile = async () => {
    try {
      setFetching(true);

      const [userRes, medicalRes] = await Promise.all([
        profileService.getUserInfo(),
        profileService.getMedicalProfile(),
      ]);

      const user = userRes.data.data;
      const benhNhan = medicalRes.data;

      setFormData({
        hoVaTen: user.hoVaTen || '',
        email: user.email || '',
        soDienThoai: user.soDienThoai || '',
        ngaySinh: user.ngaySinh
          ? new Date(user.ngaySinh).toISOString().split('T')[0]
          : '',
        gioiTinh: user.gioiTinh || 'Nam',
        diaChi: user.diaChi || '',
        chieuCao: benhNhan?.chieuCao ? String(benhNhan.chieuCao) : '',
        canNang: benhNhan?.canNang ? String(benhNhan.canNang) : '',
        tienSuChanThuong: benhNhan?.tienSuChanThuong || '',
        tinhTrangHienTai: benhNhan?.tinhTrangHienTai || '',
      });
    } catch (error) {
      console.error('Lỗi tải hồ sơ:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update profile
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const payload: any = { ...formData };
      if (!payload.ngaySinh) delete payload.ngaySinh;

      await profileService.updateProfile(payload);

      Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật!');
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    fetching,
    handleUpdate,
  };
};