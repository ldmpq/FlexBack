import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import HeaderNavigation from '../components/navigation/header.navigation';

const ItemDetailScreen = ({ route, navigation }: any) => {
  const { item } = route.params;

  const displayData = {
    name: item.name || item.tenBaiTap || item.tenThuoc || item.tenThucPham,
    description: item.description || item.moTa || item.congDung || item.chiTiet || "Chưa có mô tả chi tiết.",
    // Các trường riêng của Bài tập
    level: item.mucDo,       // Dễ/Trung bình/Khó
    tools: item.dungCu,      // Tạ, thảm...
    video: item.videoUrl,    // Link Youtube
  };

  const getTheme = () => {
    if (item.category === 'EXERCISE' || item.tenBaiTap) {
        return { color: '#0284c7', bg: '#e0f2fe', icon: <FontAwesome5 name="dumbbell" size={40} color="#0284c7" />, type: 'Bài tập' };
    }
    if (item.category === 'MEDICINE' || item.tenThuoc) {
        return { color: '#db2777', bg: '#fce7f3', icon: <FontAwesome5 name="pills" size={40} color="#db2777" />, type: 'Thuốc' };
    }
    if (item.category === 'FOOD' || item.tenThucPham) {
        return { color: '#16a34a', bg: '#dcfce7', icon: <MaterialIcons name="restaurant-menu" size={48} color="#16a34a" />, type: 'Thực phẩm' };
    }
    return { color: '#d97706', bg: '#fef3c7', icon: <FontAwesome5 name="book-open" size={40} color="#d97706" />, type: 'Kiến thức' };
  };

  const theme = getTheme();

  const handleOpenVideo = () => {
    if (displayData.video) {
      Linking.openURL(displayData.video).catch(err => console.error("Không thể mở link:", err));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <HeaderNavigation title="Chi tiết" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={[styles.bannerContainer, { backgroundColor: theme.bg }]}>
          {theme.icon}
        </View>

        {/* Tiêu đề */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{displayData.name}</Text>
          <View style={[styles.badge, { backgroundColor: theme.bg }]}>
             <Text style={[styles.badgeText, { color: theme.color }]}>{theme.type}</Text>
          </View>
        </View>

        {/* --- PHẦN RIÊNG CHO BÀI TẬP --- */}
        {(displayData.level || displayData.tools) && (
          <View style={styles.statsContainer}>
            {displayData.level && (
              <View style={styles.statItem}>
                <Feather name="bar-chart-2" size={20} color="#666" />
                <Text style={styles.statLabel}>Mức độ:</Text>
                <Text style={[styles.statValue, { color: theme.color }]}>{displayData.level}</Text>
              </View>
            )}
            {displayData.tools && (
              <View style={styles.statItem}>
                <FontAwesome5 name="tools" size={16} color="#666" />
                <Text style={styles.statLabel}>Dụng cụ:</Text>
                <Text style={styles.statValue}>{displayData.tools}</Text>
              </View>
            )}
          </View>
        )}

        {/* Nội dung chi tiết */}
        <View style={styles.contentCard}>
          <Text style={styles.sectionHeader}>Thông tin chi tiết</Text>
          <Text style={styles.description}>
            {displayData.description}
          </Text>
        </View>

        {/* Nút xem Video (Chỉ hiện nếu là Bài tập có link) */}
        {displayData.video ? (
           <TouchableOpacity style={styles.videoButton} onPress={handleOpenVideo}>
              <Ionicons name="play-circle" size={24} color="#fff" />
              <Text style={styles.videoText}>Xem Video Hướng dẫn</Text>
           </TouchableOpacity>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  scrollContent: { paddingBottom: 40 },
  bannerContainer: {
    height: 180, justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  titleSection: { paddingHorizontal: 20, marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 10 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontWeight: '600', fontSize: 14 },

  statsContainer: {
    flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20, marginBottom: 20,
    backgroundColor: '#fff', padding: 15, borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statLabel: { color: '#666', fontSize: 14 },
  statValue: { fontWeight: 'bold', color: '#333', fontSize: 14 },

  contentCard: {
    backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#3b82f6', paddingLeft: 10 },
  description: { fontSize: 16, lineHeight: 26, color: '#4b5563', textAlign: 'justify' },
  
  videoButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ef4444', marginHorizontal: 20, marginTop: 20, padding: 15, borderRadius: 12, gap: 10,
    shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
  },
  videoText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default ItemDetailScreen;