import { useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/auth.service';
import { setAuthToken } from '../utils/axiosClient';

export const useAuthManager = (navigation: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      setLoading(true);
      const data = await authService.login({
        tenTaiKhoan: username,
        matKhau: password
      });

      if (data.user.loaiTaiKhoan !== 'BENH_NHAN') {
        Alert.alert('Lỗi', 'Ứng dụng này chỉ dành cho Bệnh nhân!');
        return;
      }

      // Lưu token
      if (data.token) {
        setAuthToken(data.token);
        //await AsyncStorage.setItem('token', data.token); 
      }

      Alert.alert(
        'Đăng nhâp thành công', 
        `Xin chào ${data.user.hoVaTen}`,
        [{ text: 'OK', onPress: () => navigation.replace('AppTabs') }]
      );

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      Alert.alert('Đăng nhập thất bại', msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    username, setUsername,
    password, setPassword,
    showPass, setShowPass,
    loading,
    handleLogin
  };
};