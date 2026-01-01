import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useProgram } from '../../hooks/useProgram';
import { MucTieu, LoTrinh } from '../../types/program.type';
import { useNavigation } from '@react-navigation/native';

const ProgramTab = () => {
  const navigation = useNavigation<any>();
  const { program, loading, refreshing, onRefresh } = useProgram();
  
  // State để mở rộng/thu gọn từng mục tiêu
  const [expandedGoals, setExpandedGoals] = useState<Record<number, boolean>>({});

  const toggleGoal = (id: number) => {
    setExpandedGoals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Hàm format ngày tháng
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (e) { return dateString; }
  };

  const getPriorityColor = (priority: string) => {
    const p = priority?.toLowerCase();
    if (p === 'cao') return '#ef4444';
    if (p === 'thap') return '#22c55e';
    return '#eab308';
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1ec8a5" />
        <Text style={styles.loadingText}>Đang tải lộ trình...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Lộ trình điều trị</Text>
        {program && (
          <View style={styles.diagnosisContainer}>
             <MaterialCommunityIcons name="stethoscope" size={16} color="#666" style={{marginRight: 5}}/>
             <Text style={styles.diagnosisText} numberOfLines={1}>Chẩn đoán: {program.chanDoan}</Text>
          </View>
        )}
        
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1ec8a5']} />}
      >
        {!program || !program.MucTieuDieuTri || program.MucTieuDieuTri.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="clipboard-list" size={50} color="#ddd" />
            <Text style={styles.emptyText}>Chưa có lộ trình điều trị nào.</Text>
            <Text style={styles.emptySubText}>Vui lòng liên hệ bác sĩ để được tạo lộ trình.</Text>
          </View>
        ) : (
          program.MucTieuDieuTri.map((mucTieu: MucTieu) => (
            <View key={mucTieu.maMucTieu} style={styles.goalCard}>
              {/* Goal Header */}
              <TouchableOpacity 
                style={styles.goalHeader} 
                onPress={() => toggleGoal(mucTieu.maMucTieu)}
                activeOpacity={0.7}
              >
                <View style={styles.goalIconContainer}>
                  <MaterialCommunityIcons name="target" size={24} color="#fff" />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>{mucTieu.noiDung}</Text>
                  <View style={styles.goalMeta}>
                    <Text style={[styles.priorityBadge, { color: getPriorityColor(mucTieu.mucDoUuTien) }]}>
                      Ưu tiên: {mucTieu.mucDoUuTien}
                    </Text>
                    <Text style={styles.goalDate}>Ngày đặt: {formatDate(mucTieu.ngayDatMucTieu)}</Text>
                  </View>
                </View>
                <Feather 
                  name={expandedGoals[mucTieu.maMucTieu] ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color="#999" 
                />
              </TouchableOpacity>

              {/* Danh sách các giai đoạn (Lộ trình con) */}
              {expandedGoals[mucTieu.maMucTieu] && (
                <View style={styles.phasesContainer}>
                  {mucTieu.LoTrinhDieuTri && mucTieu.LoTrinhDieuTri.length > 0 ? (
                    mucTieu.LoTrinhDieuTri.map((loTrinh: LoTrinh, index) => (
                      <View key={loTrinh.maLoTrinh} style={styles.phaseItem}>
                        {/* Timeline Connector */}
                        <View style={styles.timelineContainer}>
                          <View style={styles.timelineDot} />
                          {index < (mucTieu.LoTrinhDieuTri?.length || 0) - 1 && <View style={styles.timelineLine} />}
                        </View>
                        
                        <View style={styles.phaseContent}>
                          <Text style={styles.phaseTitle}>{loTrinh.tenLoTrinh}</Text>
                          <View style={styles.phaseTime}>
                            <Feather name="clock" size={12} color="#888" style={{marginRight: 4}}/>
                            <Text style={styles.phaseDate}>
                              {formatDate(loTrinh.thoiGianBatDau)} - {formatDate(loTrinh.thoiGianKetThuc)}
                            </Text>
                          </View>
                          {loTrinh.ghiChu ? (
                             <Text style={styles.phaseNote}>{loTrinh.ghiChu}</Text>
                          ) : null}
                          
                          <TouchableOpacity
                            style={styles.viewDetailBtn}
                            onPress={() => navigation.navigate('PhaseDetail', {
                              title: loTrinh.tenLoTrinh,
                              exercises: loTrinh.ChiTietBaiTap
                            })}>
                             <Text style={styles.viewDetailText}>Xem bài tập</Text>
                             <Feather name="arrow-right" size={14} color="#1ec8a5" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noPhaseText}>Chưa có giai đoạn điều trị nào cho mục tiêu này.</Text>
                  )}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
  },

  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',

    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },

  diagnosisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  diagnosisText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 15,
  },

  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,

    backgroundColor: '#fff',
  },

  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,

    backgroundColor: '#1ec8a5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  goalInfo: {
    flex: 1,
  },

  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  priorityBadge: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 10,
    textTransform: 'uppercase',
  },

  goalDate: {
    fontSize: 12,
    color: '#999',
  },

  phasesContainer: {
    backgroundColor: '#f9fbf7',
    padding: 16,

    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  phaseItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },

  timelineContainer: {
    alignItems: 'center',
    marginRight: 12,
    width: 20,
  },

  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1ec8a5',
    marginTop: 6,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#dcfce7',
    marginVertical: 4,
  },

  phaseContent: {
    flex: 1,
    paddingBottom: 20,
  },

  phaseTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  phaseTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },

  phaseDate: {
    fontSize: 12,
    color: '#666',
  },

  phaseNote: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 8,
  },

  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',

    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1ec8a5',
    marginTop: 4,
  },

  viewDetailText: {
    fontSize: 12,
    color: '#1ec8a5',
    fontWeight: '600',
    marginRight: 4,
  },

  noPhaseText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
});

export default ProgramTab;