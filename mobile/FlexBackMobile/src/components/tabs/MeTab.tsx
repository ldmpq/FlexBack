import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Image } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axiosClient, { setAuthToken } from '../../utils/axiosClient';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const MeTab = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get('/auth/me');
        setUser(res.data.data);
      } catch (error) {
        console.log('Lỗi lấy thông tin:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đồng ý", 
          style: 'destructive',
          onPress: async () => {
            try {
              // Xóa token trong axios client
              setAuthToken('');
              
              // Xóa token trong AsyncStorage
              //await AsyncStorage.removeItem('token');

              // Reset Navigation về màn hình Login (để không back)
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error("Lỗi khi đăng xuất:", error);
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.hoVaTen ? user.hoVaTen.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.hoVaTen || 'Người dùng'}</Text>
          <Text style={styles.userEmail}>{user?.tenTaiKhoan || 'user@example.com'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Bệnh nhân</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('UpdateProfile')}>
          <Feather name="edit-2" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Tài khoản</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UpdateProfile')}>
          <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
            <Feather name="user" size={20} color="#0284c7" />
          </View>
          <Text style={styles.menuText}>Thông tin cá nhân</Text>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
            <Feather name="lock" size={20} color="#d97706" />
          </View>
          <Text style={styles.menuText}>Đổi mật khẩu</Text>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconBox, { backgroundColor: '#dcfce7' }]}>
            <Feather name="bell" size={20} color="#16a34a" />
          </View>
          <Text style={styles.menuText}>Thông báo</Text>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Cài đặt</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconBox, { backgroundColor: '#f3f4f6' }]}>
            <Feather name="settings" size={20} color="#4b5563" />
          </View>
          <Text style={styles.menuText}>Cài đặt ứng dụng</Text>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconBox, { backgroundColor: '#f3f4f6' }]}>
            <Feather name="help-circle" size={20} color="#4b5563" />
          </View>
          <Text style={styles.menuText}>Trợ giúp & Hỗ trợ</Text>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6f8f38',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
  },
  editButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  menuContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 12,
    marginTop: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: '#d1d5db',
    fontSize: 12,
  }
});

export default MeTab;