import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import axiosClient, { setAuthToken } from '../utils/axiosClient';

const RegisterScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !username || !password || !confirmPassword) return Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
    if (password !== confirmPassword) return Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp!');

    try {
      setLoading(true);      
      await axiosClient.post('/auth/register', {
        hoVaTen: fullName, tenTaiKhoan: username, soDienThoai: phone, matKhau: password, loaiTaiKhoan: 'BENH_NHAN'
      });
      const loginRes = await axiosClient.post('/auth/login', { tenTaiKhoan: username, matKhau: password });

      if (loginRes.data?.token) setAuthToken(loginRes.data.token);

      Alert.alert('Thành công', 'Đăng ký thành công! Hãy hoàn thiện hồ sơ.', [
          { text: 'Cập nhật ngay', onPress: () => navigation.replace('UpdateProfile') }
      ]);
    } catch (error: any) {
      Alert.alert('Đăng ký thất bại', error.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Bắt đầu hành trình mới từ đây</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#aaa" value={fullName} onChangeText={setFullName}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#aaa" value={username} onChangeText={setUsername} autoCapitalize="none"/>
            </View>
             <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#aaa" value={phone} onChangeText={setPhone} keyboardType="phone-pad"/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry value={password} onChangeText={setPassword}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#aaa" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword}/>
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerText}>Sign Up</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Bạn đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },

  /* ================= HEADER ================= */
  header: {
    marginBottom: 20,
  },

  backButton: {
    width: 40,
    height: 40,

    borderRadius: 12,
    backgroundColor: '#F5F5F5',

    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ================= TITLE ================= */
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
  },

  /* ================= FORM ================= */
  form: {
    gap: 16,
  },

  inputContainer: {
    height: 56,
    paddingHorizontal: 16,

    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,

    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },

  input: {
    fontSize: 15,
    color: '#333',
  },

  /* ================= BUTTON ================= */
  registerButton: {
    height: 56,
    marginTop: 10,

    backgroundColor: '#00C269',
    borderRadius: 12,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#00C269',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  registerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  /* ================= FOOTER ================= */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },

  footerText: {
    fontSize: 14,
    color: '#888',
  },

  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00C269',
  },
});

export default RegisterScreen;