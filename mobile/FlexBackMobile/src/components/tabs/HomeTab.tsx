import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import axiosClient from '../../utils/axiosClient';

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
        console.error('Lỗi tải thông tin cá nhân:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Xin chào 👋</Text>
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
            {user?.hoVaTen?.charAt(0) || 'B'}
          </Text>
        </View>
      </View>

      {/* ===== SEARCH ===== */}
      <View style={styles.searchWrapper}>
        <Feather name="search" size={18} color="#888" />
        <TextInput
          placeholder="Tìm kiếm bài tập, bác sĩ..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ===== CARD: BÀI TẬP ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bài tập hôm nay</Text>
          <Text style={styles.cardContent}>
            Bạn chưa có bài tập nào cho hôm nay.
          </Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Bắt đầu ngay</Text>
          </TouchableOpacity>
        </View>

        {/* ===== CARD: TIẾN ĐỘ ===== */}
        <View style={[styles.card, styles.progressCard]}>
          <Text style={[styles.cardTitle, { color: '#2e7d32' }]}>
            Tiến độ tuần này
          </Text>
          <Text style={styles.cardContent}>
            Hoàn thành 0/5 buổi tập
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  /* ===== HEADER ===== */
  header: {
    backgroundColor: '#1ec8a5',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
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
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff55',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /* ===== SEARCH ===== */
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -22,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },

  /* ===== CONTENT ===== */
  content: {
    padding: 20,
    paddingTop: 30,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

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

  progressCard: {
    backgroundColor: '#e8f7f0',
  },
});

export default HomeTab;
