import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const GuideTab = () => {
  const navigation = useNavigation<any>();

  const handleNavigate = (category: string, title: string) => {
    navigation.navigate('GuideDetail', { category, title });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Thư viện Hướng dẫn</Text>
        <Text style={styles.headerSubtitle}>Tra cứu thông tin phục hồi</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridButton} onPress={() => handleNavigate('EXERCISE', 'Danh mục bài tập')}>
            <View style={[styles.iconCircle, { backgroundColor: '#e0f2fe' }]}>
              <FontAwesome5 name="dumbbell" size={28} color="#0284c7" />
            </View>
            <Text style={styles.gridLabel}>Bài tập</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridButton} onPress={() => handleNavigate('MEDICINE', 'Danh mục Thuốc')}>
            <View style={[styles.iconCircle, { backgroundColor: '#fce7f3' }]}>
              <FontAwesome5 name="pills" size={28} color="#db2777" />
            </View>
            <Text style={styles.gridLabel}>Thuốc</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridButton} onPress={() => handleNavigate('FOOD', 'Chế độ Dinh dưỡng')}>
            <View style={[styles.iconCircle, { backgroundColor: '#dcfce7' }]}>
              <MaterialIcons name="restaurant-menu" size={28} color="#16a34a" />
            </View>
            <Text style={styles.gridLabel}>Thực phẩm</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridButton} onPress={() => Alert.alert('Thông báo','Chức năng đang trong quá trình phát triển 😄')}>
            <View style={[styles.iconCircle, { backgroundColor: '#fef3c7' }]}>
              <Feather name="book-open" size={28} color="#d97706" />
            </View>
            <Text style={styles.gridLabel}>Kiến thức</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f7fb' },
  headerContainer: { 
    padding: 20, 
    paddingBottom: 25,
    backgroundColor: '#1ec8a5',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#eafff9', marginTop: 4 },
  
  contentContainer: { padding: 20 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  gridButton: {
    width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 18,
    alignItems: 'center', marginBottom: 16, 
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    borderWidth: 0,
  },
  iconCircle: {
    width: 60, height: 60, borderRadius: 30, justifyContent: 'center',
    alignItems: 'center', marginBottom: 12,
  },
  gridLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
});

export default GuideTab;