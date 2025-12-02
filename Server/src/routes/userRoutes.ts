import { Router } from 'express';
import { getAllBenhNhan, getBenhNhanById } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Chỉ user đã đăng nhập mới được xem danh sách
router.get('/benh-nhan', authenticateToken, getAllBenhNhan);
router.get('/benh-nhan/:id', authenticateToken, getBenhNhanById);

export default router;