import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import VideoModal from '../components/modals/VideoModal';
import YoutubeModal from '../components/modals/YoutubeModal';
import HeaderNavigation from '../components/navigation/header.navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:3000';
const SESSION_KEY = '@workout_session_start';

const PhaseDetailScreen = ({ route, navigation }: any) => {
  const { title, exercises } = route.params || {};
  const maKeHoach = exercises && exercises.length > 0 ? exercises[0].maKeHoach : null;

  const [videoVisible, setVideoVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [youtubeVisible, setYoutubeVisible] = useState(false);

  const openVideo = (url: string) => {
    if (!url) {
      Alert.alert("Thông báo", "Bài tập này chưa có video hướng dẫn.");
      return;
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setCurrentVideoUrl(url);
      setYoutubeVisible(true);
      return;
    }
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    setCurrentVideoUrl(fullUrl);
    setVideoVisible(true);
  };

  const closeVideo = () => {
    setVideoVisible(false);
    setCurrentVideoUrl(null);
  };

  const getFormattedList = () => {
    return exercises.map((item: any) => ({
      sets: item.soSet,
      reps: item.soRep,
      ghiChu: item.ghiChu,
      cuongDo: item.cuongDo || 'Vừa',
      BaiTapPhucHoi: {
        maBaiTap: item.maBaiTap,
        tenBaiTap: item.tenBaiTap,
        moTa: item.moTaBaiTap,
        videoHuongDan: item.videoHuongDan,
        dungCuCanThiet: item.dungCuCanThiet,
        thoiLuongPhut: item.thoiLuongPhut
      }
    }));
  };

  const handleStartPhase = async () => {
    if (!exercises || exercises.length === 0) {
        Alert.alert("Thông báo", "Giai đoạn này chưa có bài tập nào.");
        return;
    }

    await AsyncStorage.setItem(SESSION_KEY, new Date().toISOString());

    const formattedList = getFormattedList();

    navigation.navigate('ExerciseDetail', { 
      exerciseList: formattedList,
      initialIndex: 0,
      maKeHoach: maKeHoach, 
      planTitle: title
    });
  };

  const handlePressExercise = (selectedIndex: number) => {
    const formattedList = getFormattedList();

    navigation.navigate('ExerciseDetail', { 
      exerciseList: formattedList,
      initialIndex: selectedIndex,
      maKeHoach: maKeHoach, 
      planTitle: title
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <HeaderNavigation title={title || 'Chi tiết giai đoạn'} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {!exercises || exercises.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="dumbbell" size={48} color="#ddd" />
            <Text style={styles.emptyText}>Chưa có bài tập nào trong giai đoạn này.</Text>
          </View>
        ) : (
          exercises.map((item: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => handlePressExercise(index)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <FontAwesome5 name="running" size={20} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exerciseName}>{item.tenBaiTap}</Text>
                  {item.dungCuCanThiet ? (
                    <Text style={styles.subText}>Dụng cụ: {item.dungCuCanThiet}</Text>
                  ) : null}
                </View>
                <Feather name="chevron-right" size={24} color="#ccc" />
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{item.soSet}</Text>
                  <Text style={styles.statLabel}>Sets</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{item.soRep}</Text>
                  <Text style={styles.statLabel}>Reps</Text>
                </View>
                {item.thoiLuongPhut > 0 && (
                  <>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{item.thoiLuongPhut}'</Text>
                      <Text style={styles.statLabel}>Thời gian</Text>
                    </View>
                  </>
                )}
              </View>

              {item.ghiChu ? (
                <View style={styles.noteContainer}>
                  <Feather name="info" size={14} color="#d97706" style={{ marginTop: 2 }} />
                  <Text style={styles.noteText} numberOfLines={1}>Lưu ý: {item.ghiChu}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartPhase}>
          <FontAwesome5 name="play" size={16} color="#fff" />
          <Text style={styles.startButtonText}>Bắt đầu tập</Text>
        </TouchableOpacity>
      </View>

      {videoVisible && <VideoModal visible={videoVisible} videoUrl={currentVideoUrl} onClose={closeVideo} />}
      <YoutubeModal visible={youtubeVisible} youtubeUrl={currentVideoUrl} onClose={() => setYoutubeVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    color: '#999',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1ec8a5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9fbf7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1ec8a5',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 13,
    color: '#b45309',
    marginLeft: 8,
    flex: 1,
  },
  footerContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  startButton: {
    backgroundColor: '#1ec8a5',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#1ec8a5',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    elevation: 4
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhaseDetailScreen;