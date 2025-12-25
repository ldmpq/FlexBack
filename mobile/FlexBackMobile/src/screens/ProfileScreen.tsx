import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import axiosClient from '../utils/axiosClient';

const ProfileScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    // Thông tin cá nhân
    hoVaTen: '',
    email: '',
    soDienThoai: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    diaChi: '',
    
    // Hồ sơ điều trị
    chieuCao: '',
    canNang: '',
    tienSuChanThuong: '',
    tinhTrangHienTai: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. Load thông tin người dùng khi vào màn hình
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        // Gọi API lấy thông tin chi tiết (bao gồm cả Account và BenhNhan)
        const [userRes, medicalRes] = await Promise.all([
          axiosClient.get('/auth/me'),
          axiosClient.get('/users/profile')
        ]);
        const user = userRes.data.data;
        const benhNhan = medicalRes.data;

        setFormData({
          // Thông tin từ bảng TaiKhoan
          hoVaTen: user.hoVaTen || '',
          email: user.email || '',
          soDienThoai: user.soDienThoai || '',
          ngaySinh: user.ngaySinh ? new Date(user.ngaySinh).toISOString().split('T')[0] : '',
          gioiTinh: user.gioiTinh || 'Nam',
          diaChi: user.diaChi || '',

          // Thông tin từ bảng BenhNhan (nếu có)
          chieuCao: benhNhan?.chieuCao ? String(benhNhan.chieuCao) : '',
          canNang: benhNhan?.canNang ? String(benhNhan.canNang) : '',
          tienSuChanThuong: benhNhan?.tienSuChanThuong || '',
          tinhTrangHienTai: benhNhan?.tinhTrangHienTai || ''
        });

      } catch (error) {
        console.error("Lỗi tải hồ sơ:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin cá nhân.");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. Xử lý cập nhật
  const handleUpdate = async () => {
    try {
      setLoading(true);
      
      const payload: any = { ...formData };

      if (!payload.ngaySinh) delete payload.ngaySinh;
      
      // Gọi API cập nhật chung
      await axiosClient.put('/users/profile', payload);
      
      Alert.alert(
        "Thành công", 
        "Thông tin cá nhân đã được cập nhật!", 
        [{ text: "OK" }] // Ở lại màn hình để xem kết quả
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể cập nhật hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00C269" />
        <Text style={{marginTop: 10, color: '#666'}}>Đang tải hồ sơ...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
            <View style={{width: 40}} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.form}>
            
            <Text style={styles.sectionTitle}>Thông tin chung</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Họ và tên</Text>
                <View style={styles.inputWrapper}>
                    <Feather name="user" size={18} color="#00C269" style={styles.inputIcon} />
                    <TextInput 
                        style={styles.input} 
                        value={formData.hoVaTen} 
                        onChangeText={t => setFormData({...formData, hoVaTen: t})} 
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Số điện thoại</Text>
                <View style={styles.inputWrapper}>
                    <Feather name="phone" size={18} color="#00C269" style={styles.inputIcon} />
                    <TextInput 
                        style={styles.input} 
                        value={formData.soDienThoai} 
                        keyboardType="phone-pad"
                        onChangeText={t => setFormData({...formData, soDienThoai: t})} 
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Ngày sinh (YYYY-MM-DD)</Text>
                <View style={styles.inputWrapper}>
                    <Feather name="calendar" size={18} color="#00C269" style={styles.inputIcon} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="1990-01-01" 
                        value={formData.ngaySinh} 
                        onChangeText={t => setFormData({...formData, ngaySinh: t})} 
                    />
                </View>
            </View>

             <View style={styles.inputContainer}>
                <Text style={styles.label}>Giới tính</Text>
                <View style={styles.genderRow}>
                    <TouchableOpacity 
                        style={[styles.genderBtn, formData.gioiTinh === 'Nam' && styles.genderActive]} 
                        onPress={() => setFormData({...formData, gioiTinh: 'Nam'})}
                    >
                        <Ionicons name="male" size={16} color={formData.gioiTinh === 'Nam' ? '#fff' : '#666'} style={{marginRight: 6}}/>
                        <Text style={[styles.genderText, formData.gioiTinh === 'Nam' && {color:'#fff'}]}>Nam</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.genderBtn, formData.gioiTinh === 'Nữ' && styles.genderActive]} 
                        onPress={() => setFormData({...formData, gioiTinh: 'Nữ'})}
                    >
                        <Ionicons name="female" size={16} color={formData.gioiTinh === 'Nữ' ? '#fff' : '#666'} style={{marginRight: 6}}/>
                        <Text style={[styles.genderText, formData.gioiTinh === 'Nữ' && {color:'#fff'}]}>Nữ</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Địa chỉ</Text>
                <View style={styles.inputWrapper}>
                    <Feather name="map-pin" size={18} color="#00C269" style={styles.inputIcon} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Nhập địa chỉ..." 
                        value={formData.diaChi} 
                        onChangeText={t => setFormData({...formData, diaChi: t})} 
                    />
                </View>
            </View>

            {/* --- PHẦN 2: HỒ SƠ ĐIỀU TRỊ --- */}
            <Text style={[styles.sectionTitle, {marginTop: 20}]}>Hồ sơ điều trị</Text>

            <View style={styles.row}>
                <View style={[styles.inputContainer, {flex: 1, marginRight: 10}]}>
                    <Text style={styles.label}>Chiều cao (cm)</Text>
                    <View style={styles.inputWrapper}>
                        <FontAwesome5 name="ruler-vertical" size={16} color="#00C269" style={styles.inputIcon} />
                        <TextInput 
                            style={styles.input} 
                            keyboardType="numeric" 
                            value={formData.chieuCao} 
                            onChangeText={t => setFormData({...formData, chieuCao: t})} 
                        />
                    </View>
                </View>
                <View style={[styles.inputContainer, {flex: 1}]}>
                    <Text style={styles.label}>Cân nặng (kg)</Text>
                    <View style={styles.inputWrapper}>
                        <FontAwesome5 name="weight" size={16} color="#00C269" style={styles.inputIcon} />
                        <TextInput 
                            style={styles.input} 
                            keyboardType="numeric" 
                            value={formData.canNang} 
                            onChangeText={t => setFormData({...formData, canNang: t})} 
                        />
                    </View>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Tiền sử chấn thương</Text>
                <View style={styles.inputWrapper}>
                    <FontAwesome5 name="file-medical-alt" size={16} color="#00C269" style={styles.inputIcon} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Chưa có thông tin"
                        value={formData.tienSuChanThuong} 
                        onChangeText={t => setFormData({...formData, tienSuChanThuong: t})} 
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Tình trạng hiện tại</Text>
                <View style={[styles.inputWrapper, {height: 'auto', paddingVertical: 12}]}>
                    <FontAwesome5 name="heartbeat" size={16} color="#00C269" style={[styles.inputIcon, {marginTop: 4, alignSelf:'flex-start'}]} />
                    <TextInput 
                        style={[styles.input, {height: 60, textAlignVertical: 'top'}]} 
                        placeholder="Mô tả tình trạng..." 
                        multiline={true}
                        numberOfLines={3}
                        value={formData.tinhTrangHienTai} 
                        onChangeText={t => setFormData({...formData, tinhTrangHienTai: t})} 
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Lưu Thay Đổi</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { justifyContent: 'center', alignItems: 'center' },
  
  header: { 
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
      paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  backButton: { 
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#F5F5F5', 
    justifyContent: 'center', alignItems: 'center' 
  },

  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  
  sectionTitle: { 
      fontSize: 16, fontWeight: 'bold', color: '#3f5f18', marginBottom: 15, 
      borderBottomWidth: 2, borderBottomColor: '#eef6e8', paddingBottom: 5, alignSelf: 'flex-start'
  },
  
  form: { gap: 16 },
  inputContainer: { marginBottom: 0 },
  label: { fontSize: 13, color: '#666', marginBottom: 6, fontWeight: '600' },
  
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9',
    borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 12, paddingHorizontal: 12, height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#333' },
  
  row: { flexDirection: 'row' },
  
  genderRow: { flexDirection: 'row', gap: 12 },
  genderBtn: { 
    flex: 1, flexDirection: 'row', height: 45, borderRadius: 10, borderWidth: 1, borderColor: '#E8E8E8', 
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F9F9' 
  },
  genderActive: { backgroundColor: '#00C269', borderColor: '#00C269' },
  genderText: { fontWeight: '600', color: '#666', fontSize: 14 },
  
  button: {
    backgroundColor: '#00C269', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 20,
    shadowColor: "#00C269", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default ProfileScreen;