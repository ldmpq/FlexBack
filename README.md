# FlexBack - Rehab App

For using FlexBack, you need to follow these 3 steps:
1. To create the database, you need to `cd` into the Server directory and run the command: npx prisma generate
2. In MySQL: 
Select taikhoan table -> insert value and apply (for the Dob (ngaySinh), you should leave it as "YYYY-MM-DD" and Role(loaiTaiKhoan): ADMIN)
3. cd to Server, run this command: npx ts-node prisma/fix_passwords.ts

P/s: With Server and web-admin -> npm run dev; mobile/FlexBackMobile -> npx expo start.

And if you have any question, please contact me on Telegram or WhatsApp: (+84) 703987342
Thank you  ^^!