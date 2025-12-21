import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import VideoModal from '../components/modals/VideoModal';

const PhaseDetailScreen = ({ route, navigation }: any) => {
  const { title, exercises } = route.params || {};

  // State quản lý Modal Video
  const [videoVisible, setVideoVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  const openVideo = (url: string) => {
    if (!url) {
        Alert.alert("Thông báo", "Bài tập này chưa có video hướng dẫn.");
        return;
    }

    setCurrentVideoUrl(url);
    setVideoVisible(true);
  };

  const closeVideo = () => {
    setVideoVisible(false);
    setCurrentVideoUrl(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title || 'Chi tiết giai đoạn'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!exercises || exercises.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="dumbbell" size={48} color="#ddd" />
            <Text style={styles.emptyText}>Chưa có bài tập nào trong giai đoạn này.</Text>
          </View>
        ) : (
          exercises.map((item: any, index: number) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <FontAwesome5 name="running" size={20} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exerciseName}>{item.tenBaiTap}</Text>
                  {item.dungCuCanThiet && (
                    <Text style={styles.subText}>Dụng cụ: {item.dungCuCanThiet}</Text>
                  )}
                </View>
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

              {item.moTaBaiTap && (
                <View style={styles.descContainer}>
                  <Text style={styles.descLabel}>Hướng dẫn:</Text>
                  <Text style={styles.descText}>{item.moTaBaiTap}</Text>
                </View>
              )}

              {item.ghiChu && (
                <View style={styles.noteContainer}>
                  <Feather name="info" size={14} color="#d97706" style={{ marginTop: 2 }} />
                  <Text style={styles.noteText}>Lưu ý: {item.ghiChu}</Text>
                </View>
              )}

              {item.videoHuongDan ? (
                <TouchableOpacity 
                  style={styles.videoButton}
                  onPress={() => openVideo(item.videoHuongDan)}
                >
                  <Feather name="play-circle" size={18} color="#fff" />
                  <Text style={styles.videoButtonText}>Xem Video Hướng dẫn</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>

      {/* --- VIDEO MODAL --- */}
      <VideoModal 
        visible={videoVisible}
        videoUrl={currentVideoUrl}
        onClose={closeVideo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' 
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 16, color: '#999', fontSize: 16 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconBox: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: '#6f8f38',
    justifyContent: 'center', alignItems: 'center', marginRight: 12
  },
  exerciseName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 13, color: '#666', marginTop: 2 },

  statsContainer: { 
    flexDirection: 'row', backgroundColor: '#f9fbf7', borderRadius: 12, padding: 12, marginBottom: 12 
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#6f8f38' },
  statLabel: { fontSize: 12, color: '#888', textTransform: 'uppercase' },
  statDivider: { width: 1, backgroundColor: '#e5e7eb', marginHorizontal: 8 },

  descContainer: { marginBottom: 12 },
  descLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 4 },
  descText: { fontSize: 14, color: '#666', lineHeight: 20 },

  noteContainer: { 
    flexDirection: 'row', backgroundColor: '#fffbeb', padding: 10, borderRadius: 8, marginBottom: 12 
  },
  noteText: { fontSize: 13, color: '#b45309', marginLeft: 8, flex: 1 },

  videoButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ef4444', padding: 12, borderRadius: 10, gap: 8
  },
  videoButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 }
});

export default PhaseDetailScreen;