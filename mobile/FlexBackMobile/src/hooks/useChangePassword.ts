import { useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/auth.service';

export const useChangePassword = (onSuccess?: () => void) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp!');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(currentPassword, newPassword);

      Alert.alert('Thành công', 'Đổi mật khẩu thành công!', [
        { text: 'OK', onPress: onSuccess },
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Thất bại',
        error.response?.data?.message || 'Có lỗi xảy ra.'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    // data
    currentPassword,
    newPassword,
    confirmPassword,

    // setters
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,

    // UI state
    showCurrent,
    showNew,
    showConfirm,
    setShowCurrent,
    setShowNew,
    setShowConfirm,

    loading,
    handleChangePassword,
  };
};
