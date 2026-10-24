const fs = require('fs');
const path = require('path');

// ตรวจสอบว่าไฟล์ฟอนต์อยู่ในโฟลเดอร์ fonts ที่อยู่ในโปรเจ็กต์ของคุณ
const fontPath = path.join(__dirname, 'fonts', 'THSarabunNew.ttf');

try {
  const fontData = fs.readFileSync(fontPath);
  // แปลงข้อมูลฟอนต์เป็น Base64
  const base64 = fontData.toString('base64');
  console.log(base64);
} catch (error) {
  console.error('Error reading font file:', error);
}
