import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import axiosClient from '../utils/axiosClient';

const HomeTab = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/auth/me');
        setUser(res.data.data);
      } catch (error) {
        console.error("Lỗi tải thông tin cá nhân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Xin chào,</Text>
        
        {/* Hiển thị tên động từ API */}
        {loading ? (
           <ActivityIndicator size="small" color="#6f8f38" style={{ alignSelf: 'flex-start' }}/>
        ) : (
           <Text style={styles.userName}>
             {user?.hoVaTen || 'Bệnh nhân'}
           </Text>
        )}
      </View>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bài tập hôm nay</Text>
          <Text style={styles.cardContent}>Bạn chưa có bài tập nào cho hôm nay.</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Bắt đầu ngay</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.card, { backgroundColor: '#e8f5e2' }]}>
          <Text style={[styles.cardTitle, { color: '#3f5f18' }]}>Tiến độ tuần này</Text>
          <Text style={styles.cardContent}>Hoàn thành 0/5 buổi tập.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingTop: 30 },
  headerContainer: { padding: 20, backgroundColor: '#fff' },
  greeting: { fontSize: 16, color: '#666' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  contentContainer: { padding: 20 },
  card: {
    backgroundColor: '#f8f9fa', borderRadius: 16, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  cardContent: { fontSize: 14, color: '#666', marginBottom: 12 },
  actionButton: {
    backgroundColor: '#6f8f38', paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 8, alignSelf: 'flex-start',
  },
  actionButtonText: { color: '#fff', fontWeight: '600' },
});

export default HomeTab;