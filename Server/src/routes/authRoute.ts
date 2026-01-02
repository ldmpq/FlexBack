// src/routes/authRoutes.ts
import { Router } from 'express';
import { registerBenhNhan, login, getMe, register, changePassword, resetPassword, updateProfile } from '../controllers/authController';

import { authenticateToken } from '../middlewares/authMiddleware';


const router = Router();

router.post('/register', register);

router.post('/register-benhnhan', registerBenhNhan);

router.post('/login', login);

router.get('/me', authenticateToken, getMe);

router.put('/change-password', authenticateToken, changePassword);

router.post('/forgot-password', resetPassword);

router.put('/update-profile', authenticateToken, updateProfile);

export default router;