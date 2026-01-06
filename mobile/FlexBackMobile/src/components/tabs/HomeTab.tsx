import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import SearchBar from '../../components/common/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import axiosClient from '../../utils/axiosClient';
import { reportService } from '../../services/report.service';
import { Feedback } from '../../types/result.type';

const screenWidth = Dimensions.get("window").width

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
  
  const [todayPlans, setTodayPlans] = useState<KeHoach[]>([]);
  const [search, setSearch] = useState('');

  const [chartData, setChartData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [userRes, planRes, feedbackList] = await Promise.all([
        axiosClient.get('/auth/me'),
        axiosClient.get('/dieuTri/bai-tap-hom-nay'),
        reportService.getEvaluations()
      ]);
      setUser(userRes.data.data);
      setTodayPlans(planRes.data.data);

      const listDanhGia: Feedback[] = feedbackList; 

      if (listDanhGia.length > 0) {
        // Sắp xếp theo ngày tăng dần
        const sorted = listDanhGia.sort((a, b) => 
           new Date(a.ngayTao).getTime() - new Date(b.ngayTao).getTime()
        );
        
        // Lấy 6 mốc gần nhất
        const recent = sorted.slice(-6);

        setChartData({
          labels: recent.map(item => {
             const d = new Date(item.ngayTao);
             return `${d.getDate()}/${d.getMonth() + 1}`;
          }),
          datasets: [{
              data: recent.map(item => item.thangDiem),
              color: (opacity = 1) => `rgba(30, 200, 165, ${opacity})`,
              strokeWidth: 2
          }],
          legend: ["Điểm phục hồi"]
        });
      } else {
        setChartData(null);
      }

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

  const handleStartPlan = (plan: KeHoach) => {
    if (!plan.ChiTietKeHoach || plan.ChiTietKeHoach.length === 0) {
        alert("Kế hoạch này chưa có bài tập chi tiết.");
        return;
    }

    const tenCuThe = `${plan.tenKeHoach} - ${new Date().toLocaleDateString('vi-VN')}`;

    navigation.navigate('ExerciseDetail', {
      exerciseList: plan.ChiTietKeHoach,
      initialIndex: 0,  
      maKeHoach: plan.maKeHoach,             
      planTitle: tenCuThe
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Xin chào 👋😄</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.userName}>{user?.hoVaTen || 'Bệnh nhân'}</Text>
          )}
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.hoVaTen?.charAt(0).toUpperCase() || 'F'}</Text>
        </View>
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Bạn đang tìm điều gì thế?" containerStyle={{ marginHorizontal: 20, marginTop: -22 }}/>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1ec8a5']} />}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trạng thái hôm nay</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('vi-VN')}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1ec8a5" style={{ marginTop: 20 }} />
        ) : todayPlans.length > 0 ? (
          todayPlans.map((plan) => (
            <View key={plan.maKeHoach} style={styles.summaryCard}>
              <View style={styles.cardLeftBorder} />
              <View style={styles.cardContent}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planTitle}>{plan.tenKeHoach}</Text>
                    <View style={styles.activeBadge}>
                        <View style={styles.dot} />
                        <Text style={styles.activeText}>Có lịch tập</Text>
                    </View>
                  </View>

                  <Text style={styles.subText}>
                     Tổng cộng: <Text style={{fontWeight: 'bold', color: '#333'}}>{plan.ChiTietKeHoach?.length || 0}</Text> bài tập
                  </Text>
                  <Text style={styles.descriptionText}>
                     Hãy hoàn thành bài tập để duy trì tiến độ phục hồi của bạn nhé.
                  </Text>

                  <TouchableOpacity 
                    style={styles.startButton}
                    onPress={() => handleStartPlan(plan)}
                  >
                     <FontAwesome5 name="play" size={14} color="#fff" style={{marginRight: 8}} />
                     <Text style={styles.startButtonText}>Bắt đầu tập luyện</Text>
                  </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
             <MaterialIcons name="event-available" size={60} color="#ccc" />
             <Text style={styles.emptyTitle}>Hôm nay bạn rảnh rỗi!</Text>
             <Text style={styles.emptyDesc}>Không có lịch tập nào được chỉ định cho hôm nay. Hãy nghỉ ngơi hoặc xem lại lộ trình.</Text>
             
             <TouchableOpacity style={styles.outlineButton} onPress={() => navigation.navigate('Program')}>
                <Text style={styles.outlineButtonText}>Xem lộ trình tổng quan</Text>
             </TouchableOpacity>
          </View>        
        )}

        <View style={[styles.progressContainer, { marginTop: 24 }]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center'}}>
             <View>
               <Text style={styles.sectionTitle}>Tiến độ phục hồi</Text>
               <Text style={styles.sectionSubTitle}>Dựa trên đánh giá của bác sĩ</Text>
             </View>
             <Feather name="trending-up" size={24} color="#1ec8a5" />
          </View>
          
          <View style={styles.chartCard}>
             {chartData ? (
               <LineChart
                 data={chartData}
                 width={screenWidth - 40 - 32}
                 height={220}
                 yAxisLabel=""
                 yAxisSuffix="đ"
                 chartConfig={{
                   backgroundColor: "#fff",
                   backgroundGradientFrom: "#fff",
                   backgroundGradientTo: "#fff",
                   decimalPlaces: 1,
                   color: (opacity = 1) => `rgba(30, 200, 165, ${opacity})`,
                   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                   style: {
                     borderRadius: 16
                   },
                   propsForDots: {
                     r: "5",
                     strokeWidth: "2",
                     stroke: "#1ec8a5"
                   }
                 }}
                 bezier
                 style={{
                   marginVertical: 8,
                   borderRadius: 16
                 }}
               />
             ) : (
               <ActivityIndicator color="#1ec8a5" />
             )}
             <Text style={styles.chartNote}>Biểu đồ thể hiện mức độ phục hồi (Thang điểm 10)</Text>
          </View>
        </View>

        {/* <View style={[styles.progressContainer, { marginTop: 20 }]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
             <Text style={styles.sectionTitle}>Tiến độ tuần này</Text>
             <Feather name="trending-up" size={20} color="#1ec8a5" />
          </View>
          <View style={styles.progressCard}>
              <Text style={styles.progressContent}>Đã hoàn thành <Text style={{fontWeight: 'bold', color: '#1ec8a5'}}>0/5</Text> buổi</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '10%' }]} />
              </View>
          </View>
        </View> */}
        <View style={{height: 40}} /> 
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
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
    fontSize: 14 
  },
  userName: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginTop: 4 
  },
  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#eaea36cf', 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  content: { 
    padding: 20, 
    paddingTop: 30 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  sectionSubTitle: { 
    fontSize: 12, 
    color: '#888', 
    marginTop: 2 
  },
  dateText: { 
    fontSize: 14, 
    color: '#666' 
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  cardLeftBorder: {
    width: 6,
    backgroundColor: '#1ec8a5',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#009688', 
    marginRight: 4 
  },
  activeText: { 
    fontSize: 12, 
    color: '#009688', 
    fontWeight: '600' 
  },
  subText: { 
    fontSize: 14, 
    color: '#555', 
    marginBottom: 6 
  },
  descriptionText: { 
    fontSize: 13, 
    color: '#888', 
    marginBottom: 16 
  },
  startButton: {
    backgroundColor: '#1ec8a5',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 15 
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2
  },
  emptyTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 12 
  },
  emptyDesc: { 
    fontSize: 14, 
    color: '#888', 
    textAlign: 'center', 
    marginTop: 8, 
    marginBottom: 20, 
    lineHeight: 20 
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#1ec8a5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  outlineButtonText: { 
    color: '#1ec8a5', 
    fontWeight: '600' 
  },
  progressContainer: { 
    marginTop: 10 
  },
  progressCard: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12 
  },
  progressContent: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 8 
  },
  progressBarBg: { 
    height: 8, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 4 
  },
  progressBarFill: { 
    height: 8, 
    backgroundColor: '#1ec8a5', 
    borderRadius: 4 
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 3,
  },
  chartNote: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic'
  }
});

export default HomeTab;