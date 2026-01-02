import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const register = async (req: Request, res: Response) => {
  try {
    // Gọi hàm register mới trong AuthService
    const data = await AuthService.register(req.body);
    
    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: data
    });
  } catch (error: any) {
    console.error("Lỗi đăng ký:", error);
    res.status(400).json({ message: error.message });
  }
};

export const registerBenhNhan = async (req: Request, res: Response) => {
  try {
    const data = await AuthService.registerBenhNhan(req.body);
    res.status(201).json({
      message: 'Đăng ký thành công!',
      data
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json({
      message: 'Đăng nhập thành công!',
      ...result
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(400).json({ message: 'Không tìm thấy thông tin người dùng trong Token' });
      return;
    }

    const data = await AuthService.getMe(userId);

    res.status(200).json({
      message: 'Lấy thông tin thành công!',
      data
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };
    await AuthService.changePassword(userId, req.body);
    res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    await AuthService.forgotPassword(req.body);
    res.status(200).json({ message: 'Đặt lại mật khẩu thành công! Đăng nhập lại.' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Server/src/controllers/authController.ts

export const updateProfile = async (req: Request, res: Response) => {
  try {
    console.log("Token decoded user:", (req as any).user);

    const userPayload = (req as any).user;
    const userId = userPayload?.maTaiKhoan || userPayload?.id || userPayload?.userId;

    if (!userId) {
      console.error("Không tìm thấy ID trong token");
      return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ" });
    }

    const updatedUser = await AuthService.updateProfile(Number(userId), req.body);
    
    res.status(200).json({ 
      message: "Cập nhật thành công", 
      data: updatedUser 
    });

  } catch (error) {
    console.error("Lỗi cập nhật profile:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi cập nhật thông tin" });
  }
};