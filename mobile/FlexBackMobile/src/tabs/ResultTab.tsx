import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ResultTab = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Lịch sử & Kết quả</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionHeader}>Đã hoàn thành</Text>
        <View style={styles.historyItem}>
          <Feather name="check-circle" size={20} color="green" />
          <Text style={styles.historyText}>Bài tập giãn cơ - 12/12/2024</Text>
        </View>
        <View style={styles.historyItem}>
          <Feather name="check-circle" size={20} color="green" />
          <Text style={styles.historyText}>Bài tập Squat - 10/12/2024</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingTop: 30 },
  headerContainer: { padding: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  contentContainer: { padding: 20 },
  sectionHeader: {
    fontSize: 14, fontWeight: 'bold', color: '#888', marginBottom: 10, textTransform: 'uppercase',
  },
  historyItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  historyText: { marginLeft: 10, fontSize: 15, color: '#333' },
});

export default ResultTab;