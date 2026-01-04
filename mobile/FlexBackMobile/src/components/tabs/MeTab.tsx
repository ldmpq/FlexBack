import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axiosClient from '../../utils/axiosClient';
import { authService } from '../../services/auth.service';

const MeTab = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get('/auth/me');
        setUser(res.data.data);
      } catch (error) { console.log('Lỗi lấy thông tin:', error); }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý', style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (error) { Alert.alert('Lỗi', 'Không thể đăng xuất'); }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Updated Header to match HomeTab style */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
           <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.userName}>{user?.hoVaTen || 'Người dùng'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Bệnh nhân</Text>
          </View>
        </View>
        
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.hoVaTen ? user.hoVaTen.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Tài khoản</Text>
        
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
            <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
              <Feather name="user" size={20} color="#0284c7" />
            </View>
            <View style={styles.menuContent}>
               <Text style={styles.menuText}>Thông tin cá nhân</Text>
               <Text style={styles.menuSubText}>{user?.tenTaiKhoan || 'Chưa cập nhật'}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChangePassword')}>
            <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
              <Feather name="lock" size={20} color="#d97706" />
            </View>
            <Text style={styles.menuText}>Đổi mật khẩu</Text>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#dcfce7' }]}>
              <Feather name="bell" size={20} color="#16a34a" />
            </View>
            <Text style={styles.menuText}>Thông báo</Text>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Cài đặt</Text>

        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển 😄')}>
            <View style={[styles.iconBox, { backgroundColor: '#f3f4f6' }]}>
              <Feather name="settings" size={20} color="#4b5563" />
            </View>
            <Text style={styles.menuText}>Cài đặt ứng dụng</Text>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

           <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển 😄')}>
            <View style={[styles.iconBox, { backgroundColor: '#f3f4f6' }]}>
              <Feather name="help-circle" size={20} color="#4b5563" />
            </View>
            <Text style={styles.menuText}>Trợ giúp & Hỗ trợ</Text>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

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
  container: { flex: 1, backgroundColor: '#f5f7fb' },
  
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, paddingBottom: 30,
    backgroundColor: '#1ec8a5',
  },
  userInfo: { flex: 1 },
  greeting: { fontSize: 14, color: '#eafff9', marginBottom: 2 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, alignSelf: 'flex-start',
  },
  roleText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  
  avatarContainer: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#ffffff44',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#ffffff88',
  },
  avatarText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },

  menuContainer: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 14, fontWeight: '600', color: '#888',
    marginBottom: 10, marginTop: 10, marginLeft: 4, textTransform: 'uppercase',
  },
  
  menuGroup: {
    backgroundColor: '#fff', borderRadius: 18,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    overflow: 'hidden', marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, backgroundColor: '#fff',
  },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 68 },
  
  iconBox: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  menuContent: { flex: 1 },
  menuText: { fontSize: 16, color: '#333', fontWeight: '500' },
  menuSubText: { fontSize: 12, color: '#999', marginTop: 2 },

  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fee2e2', padding: 16, borderRadius: 18,
    marginTop: 20, marginBottom: 20,
  },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#ef4444', marginLeft: 8 },
  versionText: { textAlign: 'center', color: '#d1d5db', fontSize: 12 },
});

export default MeTab;