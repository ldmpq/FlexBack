import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createBaoCao, getMyReports } from '../controllers/baoCaoController';

const router = Router();

// Báo cáo kết quả tập luyện
router.post('/', authenticateToken, createBaoCao);

// Lấy lịch sử báo cáo của bệnh nhân
router.get('/history', authenticateToken, getMyReports);

export default router;