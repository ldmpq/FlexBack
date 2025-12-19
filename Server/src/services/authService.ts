import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterBenhNhanDTO, LoginDTO } from '../models/authModel';

export class AuthService {

  static async register(data: any) {
    const { tenTaiKhoan, matKhau, hoVaTen, email, soDienThoai } = data;

    // 1. Kiểm tra tài khoản tồn tại
    const existingUser = await prisma.taiKhoan.findFirst({
        where: { tenTaiKhoan }
    });
    
    if (existingUser) {
        throw new Error('Tên tài khoản đã tồn tại!');
    }

    // 2. Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(matKhau, 10);

    // 3. Tạo tài khoản & Bệnh nhân trong 1 transaction
    const newUser = await prisma.$transaction(async (tx) => {
        // Tạo Account
        const user = await tx.taiKhoan.create({
            data: {
                tenTaiKhoan,
                matKhau: hashedPassword,
                hoVaTen,
                email,
                soDienThoai,
                loaiTaiKhoan: 'BENH_NHAN',
                ngayTaoTaiKhoan: new Date()
            }
        });

        // Tạo Profile Bệnh nhân mặc định
        await tx.benhNhan.create({
            data: {
                maTaiKhoan: user.maTaiKhoan,
                tinhTrangHienTai: 'Mới đăng ký'
            }
        });

        return user;
    });

    return newUser;
  }

  // Đăng ký bệnh nhân
  static async registerBenhNhan(data: RegisterBenhNhanDTO) {
    const {
      tenTaiKhoan, matKhau, hoVaTen, email, soDienThoai,
      gioiTinh, ngaySinh, chieuCao, canNang,
      tienSuChanThuong, tinhTrangHienTai
    } = data;

    // Kiểm tra tài khoản đã tồn tại
    const existingUser = await prisma.taiKhoan.findFirst({
      where: {
        OR: [
          { tenTaiKhoan },
          { email }
        ]
      }
    });

    if (existingUser) {
      throw new Error('Tên tài khoản hoặc Email đã tồn tại!');
    }

    // Mã hoá password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(matKhau, salt);

    // Transaction tạo TaiKhoan + BenhNhan
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newTaiKhoan = await tx.taiKhoan.create({
        data: {
          tenTaiKhoan,
          matKhau: hashedPassword,
          hoVaTen,
          email,
          soDienThoai,
          gioiTinh,
          ngaySinh: ngaySinh ? new Date(ngaySinh) : null,
          loaiTaiKhoan: 'BENH_NHAN',
        },
      });

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

    return {
      maTaiKhoan: result.newTaiKhoan.maTaiKhoan,
      tenTaiKhoan: result.newTaiKhoan.tenTaiKhoan,
      hoVaTen: result.newTaiKhoan.hoVaTen,
    };
  }

  // Đăng nhập
  static async login(data: LoginDTO) {
    const { tenTaiKhoan, matKhau } = data;

    const user = await prisma.taiKhoan.findFirst({
      where: {
        OR: [
          { tenTaiKhoan },
          { email: tenTaiKhoan }
        ]
      }
    });

    if (!user) throw new Error('Tài khoản hoặc mật khẩu không đúng!');

    const isMatch = user.matKhau ? await bcrypt.compare(matKhau, user.matKhau) : false;

    if (!isMatch) throw new Error('Tài khoản hoặc mật khẩu không đúng!');

    const secret = process.env.JWT_SECRET || 'TryToGuessThisSecretKey_FlexBack';

    const token = jwt.sign(
      { id: user.maTaiKhoan, role: user.loaiTaiKhoan },
      secret,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        maTaiKhoan: user.maTaiKhoan,
        tenTaiKhoan: user.tenTaiKhoan,
        hoVaTen: user.hoVaTen,
        loaiTaiKhoan: user.loaiTaiKhoan,
        avatar: "https://via.placeholder.com/150"
      }
    };
  }

  // Lấy thông tin cá nhân
  static async getMe(userId: number) {
    const user = await prisma.taiKhoan.findUnique({
      where: { maTaiKhoan: userId },
      include: {
        BenhNhan: {
          include: {
            HoSoBenhAn: {
              where: {
                maBenhNhan: {
                  not: null
                }
              },
              orderBy: { ngayLapHoSo: 'desc' },
              take: 1
            }
          }
        },
        BacSi: true,
        KyThuatVien: true
      }
    });

    if (!user) throw new Error('Người dùng không tồn tại');

    const { matKhau, ...userInfo } = user;
    return userInfo;
  }
}