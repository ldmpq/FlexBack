import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons'; // Import thêm MaterialIcons
import { useNavigation } from '@react-navigation/native';
import axiosClient from '../utils/axiosClient';
import type { Feedback } from '../types/result.type';

const DoctorFeedbackScreen = () => {
  const navigation = useNavigation();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const res = await axiosClient.get('/thongbao/my-notifications'); 
      setFeedbacks(res.data.data || []);
      await axiosClient.put('/thongbao/mark-read');
    } catch (error) {
      console.error('Lỗi tải phản hồi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeedbacks();
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#22c55e'; // Xanh lá (Tốt)
    if (score >= 5) return '#eab308'; // Vàng (Khá)
    return '#ef4444'; // Đỏ (Cần cố gắng)
  };

  const renderItem = ({ item }: { item: Feedback }) => (
    <View style={[styles.card, !item.daDoc && styles.unreadCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.doctorInfo}>
          <View style={styles.avatar}>
            <FontAwesome5 name="user-md" size={14} color="#fff" />
          </View>
          <Text style={styles.doctorName}>
            {item.BacSi?.hoVaTen || 'Bác sĩ phụ trách'}
          </Text>
        </View>
        <Text style={styles.date}>
          {new Date(item.ngayTao).toLocaleDateString('vi-VN')}
        </Text>
      </View>
      
      <View style={styles.titleRow}>
        <Text style={styles.title}>{item.tieuDe}</Text>
        
        {item.thangDiem !== undefined && item.thangDiem !== null && (
            <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(item.thangDiem) }]}>
                <Ionicons name="star" size={10} color="#fff" style={{ marginRight: 2 }} />
                <Text style={styles.scoreText}>{item.thangDiem}/10</Text>
            </View>
        )}
      </View>

      <Text style={styles.content}>{item.noiDung}</Text>
      
      {!item.daDoc && <View style={styles.dot} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Screen */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phản hồi từ Bác sĩ</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Danh sách */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1ec8a5" />
        </View>
      ) : (
        <FlatList
          data={feedbacks}
          keyExtractor={(item) => item.maThongBao.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1ec8a5']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={64} color="#ddd" />
              <Text style={styles.emptyText}>Chưa có phản hồi nào từ bác sĩ.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  listContent: { padding: 16 },
  
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#1ec8a5',
    backgroundColor: '#f0fcf9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  doctorInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#1ec8a5',
    justifyContent: 'center', alignItems: 'center',
  },
  doctorName: { fontWeight: '600', color: '#555', fontSize: 12 },
  date: { fontSize: 11, color: '#999' },
  
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 8 },
  
  // Style cho huy hiệu điểm số
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  scoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  content: { fontSize: 14, color: '#555', lineHeight: 22 },
  
  dot: {
    position: 'absolute',
    top: 16, right: 16,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#ef4444',
  },

  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 16, color: '#999', fontSize: 14 },
});

export default DoctorFeedbackScreen;