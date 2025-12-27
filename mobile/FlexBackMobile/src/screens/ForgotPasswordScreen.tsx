import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, KeyboardAvoidingView, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import axiosClient from '../utils/axiosClient';
import HeaderNavigation from '../components/navigation/header.navigation';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!username || !email || !phone || !newPassword) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin để xác minh!");
      return;
    }

    if (newPassword.length < 6) {
        Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự!");
        return;
    }

    try {
      setLoading(true);
      // Gọi API Reset không cần Token
      await axiosClient.post('/auth/reset-password', {
        tenTaiKhoan: username,
        email,
        soDienThoai: phone,
        newPassword
      });
      
      Alert.alert(
        "Thành công", 
        "Mật khẩu đã được đặt lại!", 
        [{ text: "Đăng nhập", onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert("Thất bại", error.response?.data?.message || "Thông tin xác minh không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* Header */}
        <HeaderNavigation title="Quên mật khẩu" onBack={() => navigation.goBack()}/>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.guideBox}>
                <Feather name="info" size={20} color="#6f8f38" />
                <Text style={styles.guideText}>
                    Vui lòng nhập thông tin tài khoản đã đăng ký để xác minh danh tính và đặt lại mật khẩu mới.
                </Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Tên đăng nhập</Text>
                    <View style={styles.inputWrapper}>
                        <Feather name="user" size={18} color="#666" style={styles.inputIcon} />
                        <TextInput 
                            style={styles.input} 
                            placeholder="username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email đăng ký</Text>
                    <View style={styles.inputWrapper}>
                        <Feather name="mail" size={18} color="#666" style={styles.inputIcon} />
                        <TextInput 
                            style={styles.input} 
                            placeholder="email@example.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Số điện thoại</Text>
                    <View style={styles.inputWrapper}>
                        <Feather name="phone" size={18} color="#666" style={styles.inputIcon} />
                        <TextInput 
                            style={styles.input} 
                            placeholder="09xx..."
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Mật khẩu mới</Text>
                    <View style={styles.inputWrapper}>
                        <Feather name="lock" size={18} color="#666" style={styles.inputIcon} />
                        <TextInput 
                            style={styles.input} 
                            placeholder="••••••••"
                            secureTextEntry={!showPass}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            <Feather name={showPass ? "eye" : "eye-off"} size={18} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>}
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
    padding: 24,
    paddingTop: 10,
  },

  guideBox: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcfce7',
  },

  guideText: {
    flex: 1,
    marginLeft: 10,
    color: '#166534',
    fontSize: 14,
    lineHeight: 20,
  },

  form: {
    gap: 15,
  },

  inputContainer: {
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },

  button: {
    backgroundColor: '#00C269',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#00C269',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;