# FlexBack - Rehab App

# Eviroment
Node.js: v24.11.1
Prisma: 5.22.0

# About the author
Telegram or WhatsApp: (+84) 703987342

===

After clone code, for using FlexBack, you need to follow these 3 steps:
1. To create the database, open terminal, move to Server and run this command: `npx prisma generate`
2. In MySQL: 
Choose flex_back, select taikhoan table -> insert value and apply (for the Dob (ngaySinh), you should leave it as "YYYY-MM-DD" and Role(loaiTaiKhoan) as ADMIN)
3. Move to Server again, run this command: `npx ts-node prisma/fix_passwords.ts`

P/s: With Server and web-admin -> `npm run dev`; mobile/FlexBackMobile -> `npx expo start`