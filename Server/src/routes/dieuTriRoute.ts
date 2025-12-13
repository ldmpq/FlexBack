import { Router } from 'express';
import { createMucTieu } from '../controllers/mucTieuController';
import { createLoTrinh } from '../controllers/loTrinhController';

import { createKeHoach, addBaiTapToKeHoach, getBaiTapHomNay } from '../controllers/keHoachController'; 

import { authenticateToken } from '../middlewares/authMiddleware';

import { createBaoCao } from '../controllers/baoCaoController';

const router = Router();

// Tạo Mục tiêu (Cần Login)
router.post('/muctieu', authenticateToken, createMucTieu);

// Tạo Lộ trình (Cần Login)
router.post('/lotrinh', authenticateToken, createLoTrinh);

// Tạo kế hoạch và thêm bài tập vào kế hoạch
router.post('/kehoach', authenticateToken, createKeHoach);
router.post('/kehoach/them-bai-tap', authenticateToken, addBaiTapToKeHoach);

// Lấy bài tập hôm nay
router.get('/bai-tap-hom-nay', authenticateToken, getBaiTapHomNay);

// Báo cáo kết quả tập luyện
router.post('/baocao', authenticateToken, createBaoCao);

export default router;