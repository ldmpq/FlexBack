import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { reportService } from '../services/report.service';

const CreateReportScreen = ({ route, navigation }: any) => {
    // Backend cần maKeHoach
    const { maKeHoach, title } = route.params || {};

    const [danhGiaSoBo, setDanhGiaSoBo] = useState('');
    const [thoiLuong, setThoiLuong] = useState('');
    const [mucDoDau, setMucDoDau] = useState<number>(0);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // Kiểm tra maKeHoach
        if (!maKeHoach) {
            Alert.alert("Lỗi", "Không tìm thấy kế hoạch. Vui lòng quay lại và thử lại.");
            return;
        }
        if (!danhGiaSoBo) {
            Alert.alert("Thông báo", "Vui lòng nhập đánh giá sơ bộ!");
            return;
        }
        if (!thoiLuong) {
            Alert.alert("Thông báo", "Vui lòng nhập thời lượng tập luyện!");
            return;
        }
        if (mucDoDau === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn mức độ đau/mệt mỏi!");
            return;
        }

        try {
            setLoading(true);

            await reportService.createReport({
                maKeHoach: maKeHoach.toString(),
                thoiLuong: thoiLuong.toString(),
                mucDoDau: mucDoDau.toString(),
                danhGiaSoBo: danhGiaSoBo,
                ngayLuyenTap: new Date().toISOString()
            });

            Alert.alert(
                "Thành công",
                "Báo cáo luyện tập đã được gửi!",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Không thể gửi báo cáo. Vui lòng kiểm tra lại.");
        } finally {
            setLoading(false);
        }
    };

    const renderPainLevel = (level: number) => (
        <TouchableOpacity
            key={level}
            style={[styles.painBtn, mucDoDau === level && styles.painBtnActive]}
            onPress={() => setMucDoDau(level)}
        >
            <Text style={[styles.painText, mucDoDau === level && styles.painTextActive]}>{level}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Báo cáo kết quả</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Báo cáo cho:</Text>
                        <Text style={styles.infoValue}>{title || 'Kế hoạch tập luyện'}</Text>
                        <Text style={{ fontSize: 10, color: '#aaa', marginTop: 5 }}>ID: {maKeHoach}</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Đánh giá sơ bộ <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                            placeholder="Hôm nay bạn tập thế nào? Có hoàn thành hết bài không?"
                            multiline
                            value={danhGiaSoBo}
                            onChangeText={setDanhGiaSoBo}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Thời lượng tập (phút) <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ví dụ: 45"
                            keyboardType="numeric"
                            value={thoiLuong}
                            onChangeText={setThoiLuong}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Mức độ đau (1-10) <Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={styles.painRow}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(renderPainLevel)}
                        </View>
                        <Text style={styles.hintText}>1: Không đau - 10: Đau nhiều</Text>
                    </View>

                </ScrollView>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : (
                            <>
                                <Feather name="send" size={20} color="#fff" />
                                <Text style={styles.submitText}>Gửi Báo Cáo</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    backButton: {
        padding: 4,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },

    content: {
        padding: 20,
    },

    infoBox: {
        backgroundColor: '#e8f5e2',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#6f8f38',
    },

    infoLabel: {
        fontSize: 12,
        color: '#6f8f38',
        marginBottom: 4,
        fontWeight: '600',
    },

    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },

    formGroup: {
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },

    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        color: '#333',
    },

    painRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },

    painBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#fff',
    },

    painBtnActive: {
        backgroundColor: '#6f8f38',
        borderColor: '#6f8f38',
    },

    painText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },

    painTextActive: {
        color: '#fff',
    },

    hintText: {
        fontSize: 12,
        color: '#999',
        marginTop: 6,
        fontStyle: 'italic',
    },

    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },

    submitBtn: {
        backgroundColor: '#6f8f38',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreateReportScreen;
