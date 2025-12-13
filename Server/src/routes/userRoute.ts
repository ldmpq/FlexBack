import { Router } from 'express';
import { getAllBenhNhan, getBenhNhanById } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { updateProfile } from '../controllers/userController';

const router = Router();

// Chỉ user đã đăng nhập mới được xem danh sách
router.get('/benh-nhan', authenticateToken, getAllBenhNhan);
router.get('/benh-nhan/:id', authenticateToken, getBenhNhanById);

router.put('/profile', authenticateToken, updateProfile);

export default router;