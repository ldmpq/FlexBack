import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoModal from '../components/modals/VideoModal';
import YoutubeModal from '../components/modals/YoutubeModal';
import HeaderNavigation from '../components/navigation/header.navigation';
import TimerWidget from '../components/common/TimeWidget';

const BASE_URL = 'http://10.0.2.2:3000';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SESSION_KEY = '@workout_session_start';

const ExerciseDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const { exerciseList, initialIndex, planTitle, maKeHoach } = route.params as { 
    exerciseList: any[], 
    initialIndex: number,
    planTitle?: string,
    maKeHoach?: number
  };

  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const startTimeRef = useRef<Date | null>(null);
  
  // State: Kiểm soát việc đã bắt đầu hay chưa?
  const [hasStarted, setHasStarted] = useState(false);
  const [isTimerReady, setIsTimerReady] = useState(false);

  // 1. Kiểm tra nếu có session tập dở dang thì khôi phục
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedTime = await AsyncStorage.getItem(SESSION_KEY);
        if (storedTime) {
          startTimeRef.current = new Date(storedTime);
          setIsTimerReady(true);
          setHasStarted(true); // Vào thẳng màn hình tập
        }
      } catch (error) {
        console.error("Lỗi timer storage:", error);
      }
    };
    checkSession();
  }, []);

  // 2. Xử lý khi nhấn "Bắt đầu tập"
  const handleStartWorkout = async () => {
    const now = new Date();
    startTimeRef.current = now;
    
    // Lưu mốc thời gian bắt đầu
    await AsyncStorage.setItem(SESSION_KEY, now.toISOString());
    
    setIsTimerReady(true);
    setHasStarted(true); // Chuyển giao diện
  };

  // Modal State
  const [videoVisible, setVideoVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [youtubeVisible, setYoutubeVisible] = useState(false);

  const handleOpenVideo = useCallback((videoUrl: string) => {
    if (!videoUrl) {
      Alert.alert("Thông báo", "Bài tập này chưa có video hướng dẫn.");
      return;
    }
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      setCurrentVideoUrl(videoUrl);
      setYoutubeVisible(true);
    } else {
      const fullUrl = videoUrl.startsWith('http') ? videoUrl : `${BASE_URL}${videoUrl}`;
      setCurrentVideoUrl(fullUrl);
      setVideoVisible(true);
    }
  }, []);

  const handleFinishPress = () => {
    Alert.alert(
      "Hoàn thành buổi tập",
      "Bạn có chắc chắn muốn kết thúc buổi tập này không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đồng ý", 
          onPress: async () => {
            const endTime = new Date();
            const start = startTimeRef.current || new Date();
            const diffMs = endTime.getTime() - start.getTime();
            
            const totalMinutes = Math.max(1, Math.floor(diffMs / 60000));

            const finalMaKeHoach = maKeHoach || exerciseList[0]?.maKeHoach || exerciseList[0]?.BaiTapPhucHoi?.maKeHoach;

            await AsyncStorage.removeItem(SESSION_KEY);
            setIsTimerReady(false);
            setHasStarted(false);

            navigation.navigate('CreateReport', { 
               maKeHoach: finalMaKeHoach,
               duration: totalMinutes,
               title: planTitle || "Báo cáo sau khi tập"
            }); 
          } 
        }
      ]
    );
  };

  // --- VIEW 1: DANH SÁCH BÀI TẬP (OVERVIEW) ---
  const renderOverviewList = () => {
    return (
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={{padding: 16, paddingBottom: 100}}>
          {exerciseList.map((item, index) => {
             const exercise = item.BaiTapPhucHoi || {};
             return (
               <View key={index} style={styles.overviewCard}>
                 <View style={styles.overviewHeader}>
                    <View style={styles.iconBox}>
                       <FontAwesome5 name="running" size={20} color="#1ec8a5" />
                    </View>
                    <View style={{flex: 1, marginLeft: 12}}>
                       <Text style={styles.overviewTitle}>{exercise.tenBaiTap}</Text>
                       <Text style={styles.overviewSubtitle}>
                         Dụng cụ: {exercise.dungCuCanThiet || "Không"}
                       </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                 </View>
                 
                 <View style={styles.overviewStats}>
                    <View style={styles.ovStatItem}>
                       <Text style={styles.ovStatVal}>{item.sets || 0}</Text>
                       <Text style={styles.ovStatLbl}>SETS</Text>
                    </View>
                    <View style={styles.verticalLine} />
                    <View style={styles.ovStatItem}>
                       <Text style={styles.ovStatVal}>{item.reps || 0}</Text>
                       <Text style={styles.ovStatLbl}>REPS</Text>
                    </View>
                 </View>
               </View>
             )
          })}
        </ScrollView>

        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
             <FontAwesome5 name="play" size={16} color="#fff" />
             <Text style={styles.startButtonText}>Bắt đầu tập</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  // --- VIEW 2: CHI TIẾT BÀI TẬP (SWIPER) ---
  const renderExerciseItem = useCallback(({ item }: { item: any }) => {
    const exercise = item?.BaiTapPhucHoi || {};
    return (
      <View style={{ width: SCREEN_WIDTH }}> 
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.videoBanner} onPress={() => handleOpenVideo(exercise.videoHuongDan)}>
              <View style={styles.playIconContainer}>
                 <MaterialIcons name="play-arrow" size={40} color="#fff" />
              </View>
              <Text style={styles.clickToPlayText}>Xem video hướng dẫn</Text>
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.title}>{exercise.tenBaiTap || "Tên bài tập"}</Text>
            <View style={styles.tagRow}>
               {exercise.dungCuCanThiet ? (
                  <View style={styles.tag}>
                     <FontAwesome5 name="tools" size={12} color="#1ec8a5" />
                     <Text style={styles.tagText}>{exercise.dungCuCanThiet}</Text>
                  </View>
               ) : null}
               {exercise.thoiLuongPhut > 0 ? (
                  <View style={[styles.tag, {marginLeft: 8}]}>
                     <Feather name="clock" size={12} color="#1ec8a5" />
                     <Text style={styles.tagText}>{exercise.thoiLuongPhut} phút</Text>
                  </View>
               ) : null}
            </View>
          </View>

          <View style={styles.statsCard}>
             <Text style={styles.sectionTitle}>Mục tiêu hôm nay</Text>
             <View style={styles.statsRow}>
                <View style={styles.statItem}>
                   <Text style={styles.statValue}>{item.sets || '--'}</Text>
                   <Text style={styles.statLabel}>SETS</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                   <Text style={styles.statValue}>{item.reps || '--'}</Text>
                   <Text style={styles.statLabel}>REPS</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                   <Text style={styles.statValue}>{item.cuongDo || 'Vừa'}</Text>
                   <Text style={styles.statLabel}>CƯỜNG ĐỘ</Text>
                </View>
             </View>
             {item.ghiChu ? (
               <View style={styles.noteBox}>
                 <Feather name="info" size={14} color="#d97706" style={{ marginTop: 2 }} />
                 <Text style={styles.noteText}>{item.ghiChu}</Text>
               </View>
             ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hướng dẫn thực hiện</Text>
            <Text style={styles.descriptionText}>
              {exercise.moTaBaiTap || exercise.moTa || 'Chưa có mô tả chi tiết cho bài tập này.'}
            </Text>
          </View>
          <View style={{height: 100}} />
        </ScrollView>
      </View>
    );
  }, [handleOpenVideo]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      {/* HEADER */}
      <View style={styles.headerWrapper}>
        <HeaderNavigation
          title={!hasStarted ? (planTitle || "Danh sách bài tập") : `Bài tập ${currentIndex + 1}/${exerciseList?.length || 0}`}
          onBack={() => navigation.goBack()}
        />
        {/* Timer chỉ hiện khi đã bắt đầu */}
        {hasStarted && isTimerReady && (
          <View style={styles.timerOverlay}>
             <TimerWidget startTimeRef={startTimeRef} />
          </View>
        )}
      </View>

      {/* BODY: Chưa bắt đầu -> List dọc. Bắt đầu -> Slide ngang */}
      {!hasStarted ? (
         renderOverviewList()
      ) : (
        <>
          <FlatList
            data={exerciseList}
            renderItem={renderExerciseItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            getItemLayout={(data, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            removeClippedSubviews={true} 
          />

          {/* Button Hoàn thành chỉ hiện ở bài cuối cùng */}
          {exerciseList && currentIndex === exerciseList.length - 1 && (
            <View style={styles.footerContainer}>
              <TouchableOpacity style={styles.finishButton} onPress={handleFinishPress}>
                <Feather name="check-circle" size={20} color="#fff" />
                <Text style={styles.finishButtonText}>Hoàn thành & Báo cáo</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <VideoModal visible={videoVisible} videoUrl={currentVideoUrl} onClose={() => { setVideoVisible(false); setCurrentVideoUrl(null); }} />
      <YoutubeModal visible={youtubeVisible} youtubeUrl={currentVideoUrl} onClose={() => setYoutubeVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    position: 'relative',
  },
  headerWrapper: {
    position: 'relative',
    zIndex: 10,
  },
  timerOverlay: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 20,
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f2f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  overviewSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  overviewStats: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  ovStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  ovStatVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ec8a5',
  },
  ovStatLbl: {
    fontSize: 11,
    color: '#888',
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#eee',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  startButton: {
    backgroundColor: '#1ec8a5',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1ec8a5',
    shadowOpacity: 0.3,
    elevation: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: '#1ec8a5',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  videoBanner: {
    height: 180,
    backgroundColor: '#333',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  playIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  clickToPlayText: {
    color: '#fff',
    fontWeight: '500',
  },
  headerInfo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef5e6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    marginLeft: 6,
    color: '#1ec8a5',
    fontWeight: '600',
    fontSize: 13,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1ec8a5',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#eee',
  },
  noteBox: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  noteText: {
    fontSize: 13,
    color: '#b45309',
    marginLeft: 8,
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  descriptionText: {
    lineHeight: 24,
    color: '#555',
    fontSize: 15,
  },

});

export default ExerciseDetailScreen;