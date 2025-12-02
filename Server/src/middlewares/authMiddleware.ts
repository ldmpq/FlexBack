import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Định nghĩa lại kiểu Request để có thể chứa thông tin user sau khi giải mã
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // 1. Lấy token từ header (Dạng: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy phần token phía sau chữ Bearer

  if (!token) {
    res.status(401).json({ message: 'Bạn chưa đăng nhập (Không có Token)!' });
    return;
  }

  // 2. Kiểm tra token
  const secret = process.env.JWT_SECRET || 'secret_mac_dinh';

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
      return;
    }

    // 3. Nếu ngon lành, gắn thông tin user vào biến req để dùng ở bước sau
    (req as AuthRequest).user = decoded as { id: number; role: string };
    
    // 4. Cho phép đi tiếp
    next();
  });
};