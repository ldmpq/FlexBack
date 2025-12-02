import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient';
import jwt from 'jsonwebtoken';

import { AuthRequest } from '../middlewares/authMiddleware';

// API Đăng ký dành cho Bệnh nhân
export const registerBenhNhan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      tenTaiKhoan, 
      matKhau, 
      hoVaTen, 
      email, 
      soDienThoai, 
      gioiTinh, 
      ngaySinh,
      // Thông tin riêng của Bệnh nhân
      chieuCao, 
      canNang, 
      tienSuChanThuong, 
      tinhTrangHienTai 
    } = req.body;

    // 1. Kiểm tra xem tài khoản đã tồn tại chưa
    const existingUser = await prisma.taiKhoan.findFirst({
      where: {
        OR: [
          { tenTaiKhoan: tenTaiKhoan },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      res.status(400).json({ message: 'Tên tài khoản hoặc Email đã tồn tại!' });
      return;
    }

    // 2. Mã hóa password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(matKhau, salt);

    // 3. Sử dụng Transaction để tạo TaiKhoan và BenhNhan cùng lúc
    const result = await prisma.$transaction(async (tx) => {
      // Tạo TaiKhoan
      const newTaiKhoan = await tx.taiKhoan.create({
        data: {
          tenTaiKhoan,
          matKhau: hashedPassword,
          hoVaTen,
          email,
          soDienThoai,
          gioiTinh,
          ngaySinh: ngaySinh ? new Date(ngaySinh) : null, // Chuyển string sang Date
          loaiTaiKhoan: 'BENH_NHAN', // Gán cứng loại tài khoản
        }
      });

      // Tạo BenhNhan liên kết với TaiKhoan vừa tạo
      const newBenhNhan = await tx.benhNhan.create({
        data: {
          maTaiKhoan: newTaiKhoan.maTaiKhoan,
          chieuCao: chieuCao ? parseFloat(chieuCao) : null,
          canNang: canNang ? parseFloat(canNang) : null,
          tienSuChanThuong,
          tinhTrangHienTai
        }
      });

      return { newTaiKhoan, newBenhNhan };
    });

    // 4. Trả về kết quả thành công
    res.status(201).json({
      message: 'Đăng ký thành công!',
      data: {
        maTaiKhoan: result.newTaiKhoan.maTaiKhoan,
        tenTaiKhoan: result.newTaiKhoan.tenTaiKhoan,
        hoVaTen: result.newTaiKhoan.hoVaTen
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống', error });
  }
};

// API Đăng nhập (Dùng chung cho cả Bệnh nhân, Bác sĩ, Kỹ thuật viên)
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tenTaiKhoan, matKhau } = req.body;

    // 1. Tìm tài khoản trong DB
    // Cho phép đăng nhập bằng cả tên TÀI KHOẢN hoặc EMAIL
    const user = await prisma.taiKhoan.findFirst({
      where: {
        OR: [
          { tenTaiKhoan: tenTaiKhoan },
          { email: tenTaiKhoan } // Client có thể gửi email vào trường tenTaiKhoan
        ]
      }
    });

    if (!user) {
      res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không đúng!' });
      return;
    }

    // 2. Kiểm tra mật khẩu (So sánh pass gửi lên với pass mã hóa trong DB)
    // Lưu ý: user.matKhau có thể NULL nên cần check
    const isMatch = user.matKhau ? await bcrypt.compare(matKhau, user.matKhau) : false;

    if (!isMatch) {
      res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không đúng!' });
      return;
    }

    // 3. Tạo Token (JWT)
    const secret = process.env.JWT_SECRET || 'secret_mac_dinh';
    const token = jwt.sign(
      { 
        id: user.maTaiKhoan, 
        role: user.loaiTaiKhoan 
      }, 
      secret, 
      { expiresIn: '7d' } // Token hết hạn sau 7 ngày
    );

    // 4. Trả về kết quả
    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token, // Trả về key
      user: {
        maTaiKhoan: user.maTaiKhoan,
        tenTaiKhoan: user.tenTaiKhoan,
        hoVaTen: user.hoVaTen,
        loaiTaiKhoan: user.loaiTaiKhoan,
        avatar: "https://via.placeholder.com/150" // Giả lập ảnh đại diện nếu chưa có
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống', error });
  }
};

// API Lấy thông tin cá nhân (Cần có Token mới xem được)
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ép kiểu req về AuthRequest để lấy được biến .user
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      res.status(400).json({ message: 'Không tìm thấy thông tin người dùng trong Token' });
      return;
    }

    // Truy vấn lại DB để lấy thông tin mới nhất
    const user = await prisma.taiKhoan.findUnique({
      where: { maTaiKhoan: userId },
      include: {
        // Lấy kèm thông tin chi tiết (nếu là Bệnh nhân thì lấy bảng BenhNhan, Bác sĩ thì lấy BacSi, Kỹ thuật viên thì lấy KyThuatVien)
        BenhNhan: true, 
        BacSi: true,
        KyThuatVien: true
      }
    });

    if (!user) {
      res.status(404).json({ message: 'Người dùng không tồn tại' });
      return;
    }

    // Loại bỏ mật khẩu trước khi trả về để bảo mật
    const { matKhau, ...userInfo } = user;

    res.json({
      message: 'Lấy thông tin thành công!',
      data: userInfo
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống', error });
  }
};