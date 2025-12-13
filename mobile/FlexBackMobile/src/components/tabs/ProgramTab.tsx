import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

const ProgramTab = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Lộ trình điều trị</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Mock Data */}
        <View style={styles.programCard}>
          <View style={styles.programIcon}>
            <FontAwesome5 name="running" size={24} color="#fff" />
          </View>
          <View style={styles.programInfo}>
            <Text style={styles.programName}>Phục hồi chấn thương gối</Text>
            <Text style={styles.programDate}>Bắt đầu: 20/10/2023</Text>
            <Text style={styles.programStatus}>Đang thực hiện</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#ccc" />
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
  programCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginBottom: 12,
  },
  programIcon: {
    width: 50, height: 50, borderRadius: 10, backgroundColor: '#6f8f38',
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  programInfo: { flex: 1 },
  programName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  programDate: { fontSize: 12, color: '#888', marginTop: 2 },
  programStatus: { fontSize: 12, color: '#6f8f38', fontWeight: '600', marginTop: 2 },
});

export default ProgramTab;