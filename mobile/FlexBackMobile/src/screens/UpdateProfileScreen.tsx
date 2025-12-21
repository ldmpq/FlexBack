import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axiosClient from '../utils/axiosClient';

const UpdateProfileScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    ngaySinh: '', 
    gioiTinh: 'Nam', 
    diaChi: '', 
    chieuCao: '', 
    canNang: '', 
    tienSuChanThuong: '', 
    tinhTrangHienTai: ''
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload: any = { ...formData };
      
      // Làm sạch dữ liệu trước khi gửi
      if (!payload.ngaySinh) delete payload.ngaySinh;
      if (!payload.chieuCao) delete payload.chieuCao;
      if (!payload.canNang) delete payload.canNang;
      if (!payload.diaChi) delete payload.diaChi;
      if (!payload.tienSuChanThuong) delete payload.tienSuChanThuong;
      if (!payload.tinhTrangHienTai) delete payload.tinhTrangHienTai;
      
      await axiosClient.put('/users/profile', payload);
      Alert.alert("Hoàn tất", "Thông tin của bạn đã được cập nhật!", [ { text: "Đến màn hình chính", onPress: () => navigation.replace('Home') } ]);
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Complete Profile</Text>
            <Text style={styles.subtitle}>Help us tailor the best treatment for you.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Ngày sinh</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Năm-Tháng-Ngày (VD: 2000-01-01" 
                  placeholderTextColor="#aaa" 
                  value={formData.ngaySinh} 
                  onChangeText={t => setFormData({...formData, ngaySinh: t})} 
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Giới tính</Text>
                <View style={styles.genderRow}>
                    <TouchableOpacity 
                      style={[styles.genderBtn, formData.gioiTinh === 'Nam' && styles.genderActive]} 
                      onPress={() => setFormData({...formData, gioiTinh: 'Nam'})}
                    >
                        <Text style={[styles.genderText, formData.gioiTinh === 'Nam' && {color:'#fff'}]}>Nam</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.genderBtn, formData.gioiTinh === 'Nữ' && styles.genderActive]} 
                      onPress={() => setFormData({...formData, gioiTinh: 'Nữ'})}
                    >
                        <Text style={[styles.genderText, formData.gioiTinh === 'Nữ' && {color:'#fff'}]}>Nữ</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Địa chỉ</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Vui lòng nhập địa chỉ" 
                  placeholderTextColor="#aaa" 
                  value={formData.diaChi} 
                  onChangeText={t => setFormData({...formData, diaChi: t})} 
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputContainer, {flex: 1, marginRight: 10}]}>
                    <Text style={styles.label}>Chiều cao (cm)</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="170" 
                      placeholderTextColor="#aaa" 
                      keyboardType="numeric" 
                      value={formData.chieuCao} 
                      onChangeText={t => setFormData({...formData, chieuCao: t})} 
                    />
                </View>
                <View style={[styles.inputContainer, {flex: 1}]}>
                    <Text style={styles.label}>Cân nặng (kg)</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="65" 
                      placeholderTextColor="#aaa" 
                      keyboardType="numeric" 
                      value={formData.canNang} 
                      onChangeText={t => setFormData({...formData, canNang: t})} 
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Tiền sử chấn thương</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Nhập vào đây nếu có..." 
                  placeholderTextColor="#aaa" 
                  value={formData.tienSuChanThuong} 
                  onChangeText={t => setFormData({...formData, tienSuChanThuong: t})} 
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Tình trạng hiện tại</Text>
                <TextInput 
                  style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]} 
                  placeholder="Mô tả tình trạng sức khỏe hiện tại..." 
                  placeholderTextColor="#aaa" 
                  multiline={true}
                  numberOfLines={3}
                  value={formData.tinhTrangHienTai} 
                  onChangeText={t => setFormData({...formData, tinhTrangHienTai: t})} 
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Hoàn tất</Text>}
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
    paddingBottom: 40,
  },

  /* ================= TITLE ================= */
  titleContainer: {
    marginTop: 20,
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
    gap: 20,
  },

  inputContainer: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  input: {
    height: 50,
    paddingHorizontal: 16,

    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,

    fontSize: 15,
    color: '#333',
  },

  /* ================= ROWS ================= */
  row: {
    flexDirection: 'row',
  },

  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },

  genderBtn: {
    flex: 1,
    height: 48,

    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',

    backgroundColor: '#fff',

    justifyContent: 'center',
    alignItems: 'center',
  },

  genderActive: {
    backgroundColor: '#00C269',
    borderColor: '#00C269',
  },

  genderText: {
    fontWeight: '600',
    color: '#666',
  },

  /* ================= BUTTON ================= */
  button: {
    height: 56,
    marginTop: 20,

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

  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default UpdateProfileScreen;