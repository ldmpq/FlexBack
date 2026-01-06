import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import SearchBar from '../components/common/SearchBar';
import HeaderNavigation from '../components/navigation/header.navigation';
import { guideService } from '../services/guide.service';

interface GuideItem {
  id: number;
  name: string;
  description: string;
  category: 'EXERCISE' | 'MEDICINE' | 'FOOD' | 'KNOWLEDGE';
}

const GuideDetailScreen = ({ route, navigation }: any) => {
  const { category, title } = route.params; // Nhận tham số từ màn hình trước

  const [data, setData] = useState<GuideItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let rawData: any[] = [];

        if (category === 'EXERCISE') {
            rawData = await guideService.getExercises();
        } else if (category === 'MEDICINE') {
            rawData = await guideService.getMedicines();
        } else if (category === 'FOOD') {
            rawData = await guideService.getFoods();
        }

        const formattedData: GuideItem[] = rawData.map((item) => ({
            id: item.id || item.maBaiTap || item.maThuoc || item.maThucPham || Math.random(),
            name: item.name || item.tenBaiTap || item.tenThuoc || item.tenThucPham || 'Chưa cập nhật tên',
            description: item.description || item.moTa || item.congDung || '',
            category: category
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Lỗi tải dữ liệu hướng dẫn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  // Logic tìm kiếm
  const filteredData = data.filter(item => 
    (item.name || '').toLowerCase().includes(search.toLowerCase())
  );

  // Lấy icon theo loại
  const getIcon = () => {
      if (category === 'EXERCISE') return <FontAwesome5 name="dumbbell" size={20} color="#0284c7" />;
      if (category === 'MEDICINE') return <FontAwesome5 name="pills" size={20} color="#db2777" />;
      if (category === 'FOOD') return <MaterialIcons name="restaurant-menu" size={24} color="#16a34a" />;
      return <FontAwesome5 name="book-open" size={20} color="#d97706" />;
  }

  // Render từng item trong danh sách
  const renderItem = ({ item }: { item: GuideItem }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ItemDetail', { item })}>
      <View style={[styles.iconContainer, { 
          backgroundColor: category === 'EXERCISE' ? '#e0f2fe' : 
                           category === 'MEDICINE' ? '#fce7f3' : 
                           category === 'FOOD' ? '#dcfce7' : '#fef3c7' 
      }]}>
        {getIcon()}
      </View>
      <View style={styles.info}>
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

        <HeaderNavigation title={title} onBack={() => navigation.goBack()}/>

        <SearchBar value={search} onChangeText={setSearch} placeholder="Tìm kiếm..." containerStyle={{ marginHorizontal: 20, marginTop: 15}}/>

      {loading ? (
        <ActivityIndicator size="large" color="#6f8f38" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#ddd" />
                <Text style={styles.emptyText}>Không tìm thấy kết quả trùng khớp nào.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    padding: 16,
    backgroundColor: '#fff',

    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  listContent: {
    padding: 16,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,

    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  info: {
    flex: 1,
  },

  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  itemDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },

  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default GuideDetailScreen;