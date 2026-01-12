import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Đang cập nhật lại mật khẩu...');

  // 1. Tạo Hash cho mật khẩu '123456'
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('123456', salt);
  console.log('🔑 Generated Hash:', hashedPassword);

  // 2. Danh sách tài khoản cần reset mật khẩu
  const accountsToFix = ['admin'];

  for (const username of accountsToFix) {
    const user = await prisma.taiKhoan.findFirst({ where: { tenTaiKhoan: username } });
    if (user) {
      await prisma.taiKhoan.update({
        where: { maTaiKhoan: user.maTaiKhoan },
        data: { matKhau: hashedPassword },
      });
      console.log(`✅ Đã update mật khẩu cho: ${username}`);
    } else {
      console.log(`⚠️ Không tìm thấy user: ${username}`);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());