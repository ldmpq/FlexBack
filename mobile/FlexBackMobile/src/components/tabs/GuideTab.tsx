import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView} from 'react-native-safe-area-context';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const GuideTab = () => {
  const navigation = useNavigation<any>();

  // Hàm xử lý chuyển trang chung
  const handleNavigate = (category: string, title: string) => {
    navigation.navigate('GuideDetail', { category, title });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Thư viện Hướng dẫn</Text>
      </View>

      <View style={styles.gridContainer}>
        {/* 1. Bài tập */}
        <TouchableOpacity 
          style={styles.gridButton} 
          onPress={() => handleNavigate('EXERCISE', 'Danh mục bài tập')}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#e0f2fe' }]}>
            <FontAwesome5 name="dumbbell" size={28} color="#0284c7" />
          </View>
          <Text style={styles.gridLabel}>Bài tập</Text>
        </TouchableOpacity>

        {/* 2. Thuốc */}
        <TouchableOpacity 
          style={styles.gridButton}
          onPress={() => handleNavigate('MEDICINE', 'Danh mục Thuốc')}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#fce7f3' }]}>
            <FontAwesome5 name="pills" size={28} color="#db2777" />
          </View>
          <Text style={styles.gridLabel}>Thuốc</Text>
        </TouchableOpacity>

        {/* 3. Thực phẩm */}
        <TouchableOpacity 
          style={styles.gridButton}
          onPress={() => handleNavigate('FOOD', 'Chế độ Dinh dưỡng')}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#dcfce7' }]}>
            <MaterialIcons name="restaurant-menu" size={28} color="#16a34a" />
          </View>
          <Text style={styles.gridLabel}>Thực phẩm</Text>
        </TouchableOpacity>
        
        {/* 4. Kiến thức */}
        <TouchableOpacity 
          style={styles.gridButton}
          onPress={() => handleNavigate('KNOWLEDGE', 'Kiến thức Y khoa')}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#fef3c7' }]}>
            <Feather name="book-open" size={28} color="#d97706" />
          </View>
          <Text style={styles.gridLabel}>Kiến thức</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingTop: 30 },
  headerContainer: { padding: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  gridContainer: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 20,
  },
  gridButton: {
    width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 16,
    alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#f0f0f0',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, elevation: 2,
  },
  iconCircle: {
    width: 60, height: 60, borderRadius: 30, justifyContent: 'center',
    alignItems: 'center', marginBottom: 12,
  },
  gridLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
});

export default GuideTab;