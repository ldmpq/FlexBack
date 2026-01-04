import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useResult } from '../../hooks/useResult';
import { useNavigation } from '@react-navigation/native';
import axiosClient from '../../utils/axiosClient';

const ResultTab = () => {
  const { reports, loading, refreshing, onRefresh, stats } = useResult();
  const navigation = useNavigation<any>();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await axiosClient.get('/thongbao/unread-count');
        setUnreadCount(res.data.count); 
      } catch (error) { console.log(error); }
    };
    const unsubscribe = navigation.addListener('focus', () => { fetchUnreadCount(); });
    return unsubscribe;
  }, [navigation]);

  const handleOpenFeedback = () => {
    setUnreadCount(0); 
    navigation.navigate('DoctorFeedback'); 
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return dateString; }
  };

  const getPainColor = (level: number) => {
    if (level <= 2) return '#22c55e';
    if (level <= 5) return '#eab308';
    return '#ef4444';
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1ec8a5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Lịch sử & Kết quả</Text>
        
        <TouchableOpacity style={styles.feedbackButton} onPress={handleOpenFeedback}>
          <MaterialCommunityIcons name="message-text-outline" size={24} color="#1ec8a5" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1ec8a5']} />}
      >
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalSessions}</Text>
            <Text style={styles.statLabel}>Buổi tập</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalDuration}'</Text>
            <Text style={styles.statLabel}>Phút tập</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.avgPain}</Text>
            <Text style={styles.statLabel}>Đau TB</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Lịch sử tập luyện</Text>

        {reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="documents-outline" size={48} color="#ddd" />
            <Text style={styles.emptyText}>Chưa có lịch sử tập luyện nào.</Text>
          </View>
        ) : (
          reports.map((item) => (
            <View key={item.maBaoCao} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={[styles.iconBox, { backgroundColor: getPainColor(item.mucDoDau) }]}>
                  <FontAwesome5 name="dumbbell" size={16} color="#fff" />
                </View>
                <View style={styles.line} />
              </View>
              
              <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>
                  {item.KeHoachDieuTri?.LoTrinhDieuTri?.tenLoTrinh || 'Bài tập tự do'}
                </Text>
                <Text style={styles.historySubTitle}>{item.KeHoachDieuTri?.tenKeHoach}</Text>
                
                <View style={styles.metaRow}>
                   <View style={styles.metaItem}>
                      <Feather name="clock" size={12} color="#666"/>
                      <Text style={styles.metaText}>{item.thoiLuong} phút</Text>
                   </View>
                   <View style={styles.metaItem}>
                      <Feather name="activity" size={12} color="#666"/>
                      <Text style={styles.metaText}>Mức đau: {item.mucDoDau}/10</Text>
                   </View>
                </View>

                {item.danhGiaSoBo ? <Text style={styles.noteText}>"{item.danhGiaSoBo}"</Text> : null}
                <Text style={styles.dateText}>{formatDate(item.ngayLuyenTap)}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f7fb' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1ec8a5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // No border radius
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },

  feedbackButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#ef4444', minWidth: 18, height: 18,
    borderRadius: 9, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#fff',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 4 },

  contentContainer: { padding: 20 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    width: '31%',
    backgroundColor: '#fff',
    padding: 12, borderRadius: 18, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1ec8a5', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#666', textTransform: 'uppercase' },

  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 16 },

  historyItem: { flexDirection: 'row', marginBottom: 0 },
  historyLeft: { width: 40, alignItems: 'center', marginRight: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  line: { width: 2, flex: 1, backgroundColor: '#e0e0e0', marginVertical: 4 },

  historyContent: {
    flex: 1, backgroundColor: '#fff', padding: 16,
    borderRadius: 18, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    borderWidth: 0,
  },
  historyTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  historySubTitle: { fontSize: 13, color: '#666', marginBottom: 8 },
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f5f7fb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  metaText: { fontSize: 12, color: '#555' },
  noteText: { fontSize: 13, fontStyle: 'italic', color: '#444', backgroundColor: '#fffbeb', padding: 8, borderRadius: 8, marginBottom: 8 },
  dateText: { fontSize: 11, color: '#999', textAlign: 'right' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { marginTop: 10, color: '#999' },
});

export default ResultTab;