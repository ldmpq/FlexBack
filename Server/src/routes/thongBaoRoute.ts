import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { getMyNotifications, getUnreadCount, markAsRead } from '../controllers/thongBaoController';

const router = Router();

router.get('/my-notifications', authenticateToken, getMyNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.put('/mark-read', authenticateToken, markAsRead);

export default router;