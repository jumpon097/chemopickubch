# AYA Ward Pickup PWA — GitHub Pages

PWA shell สำหรับเปิด AYA Ward Pickup ผ่าน GitHub Pages และติดตั้งบนหน้าจอมือถือ/แท็บเล็ต/คอมพิวเตอร์

GAS Web App ที่ตั้งค่าไว้:

```text
https://script.google.com/macros/s/AKfycbw05VtD2oHFcwDsmO4TMgzBIwdFPcbvimvSxfnO75r21uPlVWsa7WhHspQj6yYRvns6/exec
```

## สิ่งที่ชุดนี้ทำ

- แสดง GAS Web App ภายใน PWA shell ผ่าน `iframe`
- เมื่อเปิดจากไอคอน PWA ระบบจะเปิด GAS แบบ top-level ในหน้าต่างเดียวกัน เพื่อหลีกเลี่ยงการค้างจากข้อจำกัด iframe/login ของ Google
- รองรับการติดตั้งแบบ PWA ด้วย Web App Manifest
- รองรับไอคอน UBCH แบบปกติ, Apple Touch และ maskable
- อนุญาตกล้องให้ GAS iframe เพื่อใช้สแกน QR เป็นทางเลือก
- เครื่องสแกน QR แบบ USB/Bluetooth HID ทำงานเหมือนคีย์บอร์ดภายใน iframe
- มีสถานะ online/offline, ปุ่มรีเฟรช และปุ่มเปิด GAS โดยตรง
- Service worker เก็บเฉพาะ PWA shell และหน้า offline

ข้อมูลยาและ GAS Web App จะไม่ถูก cache ลง Service Worker เพราะเป็นข้อมูลข้ามโดเมนและต้องใช้ข้อมูลปัจจุบัน

## วิธีขึ้น GitHub Pages

### วิธีแนะนำ: ใช้ GitHub Actions ที่เตรียมไว้

1. สร้าง Repository ใหม่บน GitHub เช่น `aya-ward-pickup-pwa`
2. อัปโหลดไฟล์และโฟลเดอร์ทั้งหมดในชุดนี้ไว้ที่ root ของ Repository
3. ตรวจว่า branch หลักชื่อ `main`
4. ไปที่ **Settings → Pages**
5. ที่ **Build and deployment → Source** เลือก **GitHub Actions**
6. เปิดแท็บ **Actions** และรอ workflow `Deploy AYA PWA to GitHub Pages` ทำงานสำเร็จ
7. กลับไป **Settings → Pages** แล้วกด **Visit site**

ทุกครั้งที่ push เข้า `main` ระบบจะ Deploy ใหม่อัตโนมัติ

### วิธีง่าย: Deploy from a branch

ถ้าไม่ใช้ GitHub Actions:

1. ลบหรือไม่ใช้ไฟล์ `.github/workflows/pages.yml`
2. ไปที่ **Settings → Pages**
3. Source เลือก **Deploy from a branch**
4. Branch เลือก `main` และโฟลเดอร์ `/(root)`
5. กด Save แล้วรอ GitHub Pages สร้างเว็บไซต์

## การติดตั้ง PWA

### Android / Chrome / Edge

1. เปิด GitHub Pages URL
2. กดปุ่ม **ติดตั้ง** บนแถบด้านบน หรือเมนูเบราว์เซอร์ → **Install app / Add to Home screen**
3. อนุญาตกล้องเมื่อเลือกใช้กล้องสแกน QR

### iPhone / iPad

1. เปิด GitHub Pages URL ด้วย Safari
2. กดปุ่ม Share
3. เลือก **Add to Home Screen**

## เปลี่ยน GAS Web App URL

แก้ไฟล์ `config.js`:

```js
window.AYA_PWA_CONFIG = Object.freeze({
  appName: 'AYA Ward Pickup',
  gasWebAppUrl: 'วาง_URL_ที่ลงท้ายด้วย_/exec',
  launchMode: 'auto',
  redirectDelayMs: 500,
  frameTimeoutMs: 12000
});
```

`launchMode: 'auto'` หมายถึงเปิดผ่าน iframe เฉพาะตอนเข้าจากเบราว์เซอร์เพื่อใช้หน้าติดตั้ง แต่เมื่อเปิดจากไอคอน PWA จะ redirect ไป GAS ในหน้าต่างเดียวกันอัตโนมัติ หากองค์กรบล็อก iframe แม้ในเบราว์เซอร์ สามารถเปลี่ยนเป็น `launchMode: 'redirect'` ได้

## หาก PWA เดิมค้างที่ “กำลังเปิดระบบ”

หลัง Deploy เวอร์ชันนี้:

1. ปิด PWA ให้หมด
2. เปิด GitHub Pages URL ใน Chrome/Safari แล้วกดรีเฟรชหนึ่งครั้ง
3. ปิดแล้วเปิด PWA จากไอคอนใหม่
4. หากยังใช้ cache เดิม ให้ลบ PWA แล้วติดตั้งใหม่

Service worker เวอร์ชันนี้ใช้ cache `aya-pickup-pwa-v2` และโหลด `index.html`, `main.js`, `config.js` แบบ network-first เพื่อรับการแก้ไขได้เร็วขึ้น

จากนั้น push เข้า `main` ใหม่

## ข้อจำกัดและความปลอดภัย

- GitHub Pages เป็น static hosting และหน้า PWA shell อาจเข้าถึงได้สาธารณะ
- `robots.txt` และ `noindex` ช่วยไม่ให้ search engine จัดทำดัชนี แต่ไม่ใช่ระบบควบคุมสิทธิ์
- สิทธิ์จริงยังขึ้นอยู่กับการตั้งค่า Deploy ของ GAS Web App และระบบ QR/PIN ภายในแอป
- ห้ามใส่ Token, Password, PIN หรือข้อมูลผู้ป่วยลงใน Repository
- PWA ใช้งานรับ–คืนยาแบบ offline ไม่ได้ เพราะต้องตรวจสอบข้อมูลล่าสุดจาก Google Sheets/GAS
- หาก iframe ถูกนโยบายองค์กรบล็อก ให้ใช้ปุ่ม **เปิดตรง** หรือเปิด GAS URL โดยตรง

## ทดสอบก่อนใช้งานจริง

- เปิด GitHub Pages URL บน Chrome/Edge/Safari
- ติดตั้ง PWA และเปิดจากไอคอน
- สแกน QR เจ้าหน้าที่ด้วยเครื่องสแกน HID
- สแกน QR ขวดยาและตรวจว่า Timestamp ถูกบันทึก
- ทดสอบกล้องและอนุญาต Camera permission
- ทดสอบปุ่มรายงานและ Export Excel
- ปิดอินเทอร์เน็ตและยืนยันว่าระบบไม่อนุญาตให้ทำรายการ
