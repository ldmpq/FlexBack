import React from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,ActivityIndicator,Platform,KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useProfile } from '../hooks/useProfile';
import HeaderNavigation from '../components/navigation/header.navigation';

const ProfileScreen = ({ navigation }: any) => {
  const {formData, setFormData,loading,fetching, handleUpdate,} = useProfile();

  if (fetching) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1ec8a5" />
        <Text style={{ marginTop: 10, color: '#666' }}>
          Đang tải hồ sơ...
        </Text>
      </View>
    );
  }

  const formatDaTeInput = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');

    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
  };

  const isoToDisplay = (isoDate: string) => {
    if (!isoDate || !isoDate.includes('-')) return isoDate;
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* HEADER */}
        <HeaderNavigation title="Thông tin cá nhân" onBack={() => navigation.goBack()}/>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            {/* THÔNG TIN CHUNG */}
            <Text style={styles.sectionTitle}>Thông tin chung</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Họ và tên</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={18} color="#1ec8a5" />
                <TextInput
                  style={styles.input}
                  value={formData.hoVaTen}
                  onChangeText={(t) =>
                    setFormData({ ...formData, hoVaTen: t })
                  }
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Số điện thoại</Text>
              <View style={styles.inputWrapper}>
                <Feather name="phone" size={18} color="#1ec8a5" />
                <TextInput
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={formData.soDienThoai}
                  onChangeText={(t) =>
                    setFormData({ ...formData, soDienThoai: t })
                  }
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ngày sinh (DD/MM/YYYY)</Text>
              <View style={styles.inputWrapper}>
                <Feather name="calendar" size={18} color="#1ec8a5" />
                <TextInput
                  style={styles.input}
                  placeholder="01/01/1990"
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  maxLength={10}
                  value={isoToDisplay(formData.ngaySinh)} 
                  onChangeText={(t) => {
                    const formatted = formatDaTeInput(t);
                    setFormData({ ...formData, ngaySinh: formatted });
                  }}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Giới tính</Text>
              <View style={styles.genderRow}>
                {['Nam', 'Nữ'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderBtn,
                      formData.gioiTinh === gender &&
                        styles.genderActive,
                    ]}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        gioiTinh: gender,
                      })
                    }
                  >
                    <Ionicons
                      name={gender === 'Nam' ? 'male' : 'female'}
                      size={16}
                      color={
                        formData.gioiTinh === gender
                          ? '#fff'
                          : '#666'
                      }
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.genderText,
                        formData.gioiTinh === gender && {
                          color: '#fff',
                        },
                      ]}
                    >
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Địa chỉ</Text>
              <View style={styles.inputWrapper}>
                <Feather name="map-pin" size={18} color="#1ec8a5" />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập địa chỉ..."
                  value={formData.diaChi}
                  onChangeText={(t) =>
                    setFormData({ ...formData, diaChi: t })
                  }
                />
              </View>
            </View>

            {/* HỒ SƠ ĐIỀU TRỊ */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Hồ sơ điều trị
            </Text>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Chiều cao (cm)</Text>
                <View style={styles.inputWrapper}>
                  <FontAwesome5 name="ruler-vertical" size={16} color="#1ec8a5" />
                  <TextInput style={styles.input} keyboardType="numeric" value={formData.chieuCao} onChangeText={(t) => setFormData({ ...formData, chieuCao: t })}/>
                </View>
              </View>

              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Cân nặng (kg)</Text>
                <View style={styles.inputWrapper}>
                  <FontAwesome5 name="weight" size={16} color="#1ec8a5" />
                  <TextInput style={styles.input} keyboardType="numeric" value={formData.canNang} onChangeText={(t) => setFormData({ ...formData, canNang: t })}/>
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tiền sử chấn thương</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome5 name="file-medical-alt"size={16} color="#1ec8a5" />
                <TextInput style={styles.input} placeholder="Chưa có thông tin" value={formData.tienSuChanThuong} onChangeText={(t) => setFormData({...formData, tienSuChanThuong: t,})}/>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tình trạng hiện tại</Text>
              <View style={[ styles.inputWrapper, { height: 'auto', paddingVertical: 12 },]}>
                <FontAwesome5 name="heartbeat" size={16} color="#1ec8a5" style={{ marginTop: 4 }}/>
                <TextInput style={[ styles.input, { height: 60, textAlignVertical: 'top' }, ]} multiline value={formData.tinhTrangHienTai} onChangeText={(t) => setFormData({...formData, tinhTrangHienTai: t,})}/>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Lưu Thay Đổi</Text>
              )}
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

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ec8a5',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#eef6e8',
    paddingBottom: 5,
    alignSelf: 'flex-start',
  },

  form: {
    gap: 16,
  },

  inputContainer: {
    marginBottom: 0,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },

  row: {
    flexDirection: 'row',
  },

  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },

  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  genderActive: {
    backgroundColor: '#1ec8a5',
    borderColor: '#1ec8a5',
  },

  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },

  button: {
    height: 56,
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#1ec8a5',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#1ec8a5',
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

export default ProfileScreen;