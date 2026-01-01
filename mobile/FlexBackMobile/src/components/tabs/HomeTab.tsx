import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import SearchBar from '../../components/common/SearchBar';
import { useNavigation } from '@react-navigation/native';
import axiosClient from '../../utils/axiosClient';

interface BaiTap {
  maBaiTap: number;
  tenBaiTap: string;
  moTa?: string;
  hinhAnhMinhHoa?: string;
}

interface ChiTietKeHoach {
  maChiTiet: number;
  sets?: number;
  reps?: number;
  cuongDo?: string;
  ghiChu?: string;
  BaiTapPhucHoi: BaiTap;
}

interface KeHoach {
  maKeHoach: number;
  tenKeHoach: string;
  ChiTietKeHoach: ChiTietKeHoach[];
}

const HomeTab = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<any>();
  
  // State lưu danh sách kế hoạch bài tập hôm nay
  const [todayPlans, setTodayPlans] = useState<KeHoach[]>([]);
  const [search, setSearch] = useState('');

  // Hàm gọi API lấy thông tin User & Bài tập
  const fetchData = async () => {
    try {
      // Gọi song song 2 API để tối ưu tốc độ
      const [userRes, planRes] = await Promise.all([
        axiosClient.get('/auth/me'),
        axiosClient.get('/dieuTri/bai-tap-hom-nay') // Gọi vào route dieuTri
      ]);

      setUser(userRes.data.data);
      setTodayPlans(planRes.data.data);
      
    } catch (error) {
      console.error('Lỗi tải dữ liệu HomeTab:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // Hàm render từng bài tập nhỏ
  const renderExerciseItem = (detail: ChiTietKeHoach) => {
    return (
      <TouchableOpacity 
        key={detail.maChiTiet} 
        style={styles.exerciseItem}

        onPress={() => navigation.navigate('ExerciseDetail', { detail: detail })} 
      >
        <View style={styles.exerciseIconBox}>
          <MaterialIcons name="fitness-center" size={24} color="#1ec8a5" />
        </View>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.exerciseName}>{detail.BaiTapPhucHoi.tenBaiTap}</Text>
          <View style={styles.metaContainer}>
            {detail.sets && <Text style={styles.metaText}>{detail.sets} Sets</Text>}
            {detail.reps && <Text style={styles.metaText}>• {detail.reps} Reps</Text>}
            {detail.cuongDo && <Text style={styles.metaText}>• {detail.cuongDo}</Text>}
          </View>
        </View>

        <View style={styles.playButton}>
           <Feather name="chevron-right" size={24} color="#ccc" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Xin chào 👋😄</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.userName}>
              {user?.hoVaTen || 'Bệnh nhân'}
            </Text>
          )}
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.hoVaTen?.charAt(0).toUpperCase() || 'F'}
          </Text>
        </View>
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Bạn đang tìm điều gì thế?" containerStyle={{ marginHorizontal: 20, marginTop: -22 }}/>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1ec8a5']} />
        }
      >
        {/* ===== CARD: BÀI TẬP HÔM NAY ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lịch tập hôm nay</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('vi-VN')}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1ec8a5" style={{ marginTop: 20 }} />
        ) : todayPlans.length > 0 ? (
          // Mapping qua các kế hoạch đang active
          todayPlans.map((plan) => (
            <View key={plan.maKeHoach} style={styles.card}>
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>{plan.tenKeHoach}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Hôm nay</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Danh sách bài tập trong kế hoạch này */}
              {plan.ChiTietKeHoach && plan.ChiTietKeHoach.length > 0 ? (
                plan.ChiTietKeHoach.map((detail) => renderExerciseItem(detail))
              ) : (
                <Text style={styles.emptyText}>Chưa có bài tập chi tiết.</Text>
              )}
            </View>
          ))
        ) : (
          // Trường hợp không có bài tập
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hôm nay nghỉ ngơi!</Text>
            <Text style={styles.cardContent}>
              Bạn không có bài tập nào được lên lịch cho hôm nay.
            </Text>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Xem lộ trình tổng quan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ===== CARD: TIẾN ĐỘ ===== */}
        <View style={[styles.card, styles.progressCard, { marginTop: 10 }]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
             <Text style={[styles.cardTitle, { color: '#1ec8a5' }]}>
              Tiến độ tuần này
            </Text>
            <Feather name="trending-up" size={20} color="#1ec8a5" />
          </View>
         
          <Text style={styles.cardContent}>
            Hoàn thành <Text style={{fontWeight: 'bold', color: '#1ec8a5'}}>0/5</Text> buổi tập
          </Text>
          {/* Progress Bar Giả lập */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '10%' }]} />
          </View>
        </View>

        <View style={{height: 40}} /> 
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /* ===== SAFE AREA ===== */
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  /* ===== HEADER ===== */
  header: {
    backgroundColor: '#1ec8a5',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    color: '#eafff9',
    fontSize: 14,
  },

  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff44',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /* ===== CONTENT ===== */
  content: {
    padding: 20,
    paddingTop: 30,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  dateText: {
    fontSize: 14,
    color: '#666',
  },

  /* ===== CARD ===== */
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  badge: {
    backgroundColor: '#e0f2f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  badgeText: {
    color: '#009688',
    fontSize: 12,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },

  /* ===== EXERCISE ITEM ===== */
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  exerciseIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0fcf9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  metaContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },

  metaText: {
    fontSize: 13,
    color: '#888',
    marginRight: 4,
  },

  playButton: {
    padding: 4,
  },

  /* ===== GENERIC CARD STYLES ===== */
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },

  cardContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 14,
  },

  primaryButton: {
    backgroundColor: '#1ec8a5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },

  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },

  /* ===== PROGRESS CARD ===== */
  progressCard: {
    backgroundColor: '#fff',
  },

  progressBarBg: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginTop: 4,
  },

  progressBarFill: {
    height: 6,
    backgroundColor: '#1ec8a5',
    borderRadius: 3,
  },
});

export default HomeTab;