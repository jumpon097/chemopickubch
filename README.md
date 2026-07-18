# GitHub Pages PWA

แก้ `config.js` ให้ `apiUrl` ชี้ไปยัง Cloudflare Worker URL ที่ลงท้าย `/api` แล้วนำไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้น root ของ Repository

หน้าเว็บนี้ไม่มี iframe, ไม่มี GAS URL และไม่มี secret ข้อมูลสดทั้งหมดมาจาก Worker API เท่านั้น
