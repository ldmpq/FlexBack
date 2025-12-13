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
  const secret = process.env.JWT_SECRET || 'TryToGuessThisSecretKey_FlexBack';

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
      return;
    }
    
    (req as AuthRequest).user = decoded as { id: number; role: string };

    next();
  });
};

// Hàm này nhận vào một mảng vai trò (role) được phép, và trả về một middleware
export const authorizeRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = (req as AuthRequest).user?.role;
        if (!userRole) {
            return res.status(403).json({ message: 'Không tìm thấy vai trò người dùng.' });
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Không có quyền truy cập.' });
        }
        
        // Nếu vai trò hợp lệ -> đi tiếp
        next();
    };
};