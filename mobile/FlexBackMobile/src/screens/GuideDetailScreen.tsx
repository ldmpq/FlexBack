import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import SearchBar from '../components/common/SearchBar';
import HeaderNavigation from '../components/navigation/header.navigation';

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

  // Giả lập lấy dữ liệu (Sau này bạn thay bằng gọi API thật)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        let mockData: GuideItem[] = [];

        if (category === 'EXERCISE') {
            mockData = [
                { id: 1, name: 'Squat cơ bản', description: 'Tập cơ đùi và mông, giúp săn chắc chân.', category: 'EXERCISE' },
                { id: 2, name: 'Hít đất', description: 'Tăng cường cơ ngực và bắp tay sau.', category: 'EXERCISE' },
                { id: 3, name: 'Plank', description: 'Cải thiện cơ bụng và sức bền cốt lõi.', category: 'EXERCISE' },
                { id: 4, name: 'Giãn cơ cổ', description: 'Giảm đau mỏi vai gáy cho dân văn phòng.', category: 'EXERCISE' },
            ];
        } else if (category === 'MEDICINE') {
            mockData = [
                { id: 1, name: 'Paracetamol', description: 'Giảm đau, hạ sốt thông thường.', category: 'MEDICINE' },
                { id: 2, name: 'Vitamin C', description: 'Tăng cường sức đề kháng cho cơ thể.', category: 'MEDICINE' },
                { id: 3, name: 'Glucosamine', description: 'Hỗ trợ tái tạo sụn khớp, giảm đau khớp.', category: 'MEDICINE' },
                { id: 4, name: 'Omega-3', description: 'Tốt cho tim mạch và trí não.', category: 'MEDICINE' },
            ];
        } else if (category === 'FOOD') {
            mockData = [
                { id: 1, name: 'Ức gà', description: 'Nguồn protein dồi dào, ít chất béo.', category: 'FOOD' },
                { id: 2, name: 'Cá hồi', description: 'Giàu Omega-3, tốt cho tim mạch.', category: 'FOOD' },
                { id: 3, name: 'Rau chân vịt', description: 'Nhiều chất xơ, sắt và vitamin.', category: 'FOOD' },
                { id: 4, name: 'Gạo lứt', description: 'Tinh bột chậm, tốt cho người giảm cân.', category: 'FOOD' },
            ];
        }
        setData(mockData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  // Logic tìm kiếm
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
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
    <TouchableOpacity style={styles.card}>
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
      {/* Header */}
        <HeaderNavigation title={title} onBack={() => navigation.goBack()}/>

      {/* Search Bar */}
        <SearchBar value={search} onChangeText={setSearch} placeholder="Tìm kiếm..." containerStyle={{ marginHorizontal: 20, marginTop: 15}}/>

      {/* List Data */}
      {loading ? (
        <ActivityIndicator size="large" color="#6f8f38" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#ddd" />
                <Text style={styles.emptyText}>Không tìm thấy kết quả nào.</Text>
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