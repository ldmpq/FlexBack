import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createBaoCao, getMyReports, getAllReports, sendFeedback, getReportDetail } from '../controllers/baoCaoController';

const router = Router();

// Báo cáo kết quả tập luyện
router.post('/', authenticateToken, createBaoCao);

// Lấy lịch sử báo cáo của bệnh nhân
router.get('/history', authenticateToken, getMyReports);

// 1. Lấy tất cả báo cáo
router.get('/all', authenticateToken, getAllReports); 

// 2. Gửi phản hồi
router.post('/feedback', authenticateToken, sendFeedback);

// 3. Lấy chi tiết (Đặt cuối cùng để tránh trùng với /history hoặc /all)
router.get('/:id', authenticateToken, getReportDetail);

export default router;