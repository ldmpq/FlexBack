import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
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

  const [isTimerReady, setIsTimerReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkSession = async () => {
        try {
          const storedTime = await AsyncStorage.getItem(SESSION_KEY);
          if (storedTime) {
            startTimeRef.current = new Date(storedTime);
            setIsTimerReady(true);
          } else {
            setIsTimerReady(false);
            startTimeRef.current = null;
          }
        } catch (error) {
          console.error("Lỗi timer storage:", error);
        }
      };
      
      checkSession();

      return () => {};
    }, [])
  )

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
                     <Text style={styles.tagText}>Dụng cụ: {exercise.dungCuCanThiet}</Text>
                  </View>
               ) : null}
               {exercise.thoiLuongPhut && exercise.thoiLuongPhut > 0 ? (
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
      <View style={styles.headerWrapper}>
        <HeaderNavigation
          title={`Bài tập ${currentIndex + 1}/${exerciseList?.length || 0}`}
          onBack={() => navigation.goBack()}
        />
        {isTimerReady && (
          <View style={styles.timerOverlay}>
             <TimerWidget startTimeRef={startTimeRef} />
          </View>
        )}
      </View>
      
      {exerciseList && exerciseList.length > 0 ? (
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
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
           <Text style={{color: '#999'}}>Không có dữ liệu bài tập</Text>
        </View>
      )}

      {exerciseList && currentIndex === exerciseList.length - 1 && isTimerReady && (
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleFinishPress}>
             <Feather name="check-circle" size={20} color="#fff" />
             <Text style={styles.primaryButtonText}>Hoàn thành & Báo cáo</Text>
          </TouchableOpacity>
        </View>
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
  primaryButton: { 
    backgroundColor: '#1ec8a5', 
    borderRadius: 12, 
    paddingVertical: 14, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8 
  },
  primaryButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default ExerciseDetailScreen;