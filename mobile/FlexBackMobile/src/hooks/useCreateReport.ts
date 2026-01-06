import { useState } from 'react';
import { Alert } from 'react-native';
import { reportService } from '../services/report.service';

interface UseCreateReportProps {
  maKeHoach: string | number;
  navigation: any;
}

export const useCreateReport = ({
  maKeHoach,
  navigation,
}: UseCreateReportProps) => {
  const [danhGiaSoBo, setDanhGiaSoBo] = useState('');
  const [thoiLuong, setThoiLuong] = useState('');
  const [mucDoDau, setMucDoDau] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    if (!maKeHoach) {
      Alert.alert(
        'Lỗi',
        'Không tìm thấy kế hoạch. Vui lòng quay lại và thử lại.'
      );
      return false;
    }

    if (!danhGiaSoBo.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập đánh giá sơ bộ!');
      return false;
    }

    if (!thoiLuong.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập thời lượng tập luyện!');
      return false;
    }

    if (mucDoDau === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn mức độ đau/mệt mỏi!');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await reportService.createReport({
        maKeHoach: maKeHoach.toString(),
        thoiLuong: thoiLuong.toString(),
        mucDoDau: mucDoDau.toString(),
        danhGiaSoBo,
        ngayLuyenTap: new Date().toISOString(),
      });

      Alert.alert('Thành công', 'Báo cáo luyện tập đã được gửi!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('CreateReport error:', error);
      Alert.alert('Lỗi', 'Không thể gửi báo cáo. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return {
    danhGiaSoBo,
    thoiLuong,
    mucDoDau,
    loading,
    setDanhGiaSoBo,
    setThoiLuong,
    setMucDoDau,
    handleSubmit,
  };
};