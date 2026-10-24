// middleware/authTeacher.js
const jwt = require('jsonwebtoken');
const db = require('../db'); // นำเข้า instance ของ Knex จากไฟล์ db.js

// กำหนดค่า JWT secret key (หรือใช้ค่าใน environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authenticateTeacher = async (req, res, next) => {
  // ดึง token จาก header ในรูปแบบ "Bearer <token>"
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "ไม่มีโทเค็นการยืนยันตัวตน" });
  }

  // ตรวจสอบและ decode token ด้วย jwt.verify
  jwt.verify(token, JWT_SECRET, async (err, teacherPayload) => {
    if (err) {
      console.error("❌ Invalid token:", err);
      return res.status(403).json({ status: "error", message: "Invalid token" });
    }

    console.log("✅ Token Decoded:", teacherPayload);

    try {
      // ค้นหาข้อมูลอาจารย์จากตาราง teachers โดยใช้ id ที่อยู่ใน token payload
      const teacher = await db('teachers')
        .where({ id: teacherPayload.id })
        .first();

      if (!teacher) {
        return res.status(404).json({ message: "ไม่พบข้อมูลอาจารย์" });
      }

      // แนบข้อมูลอาจารย์ที่ได้ลงใน req object เพื่อใช้งานใน route handler ต่อไป
      req.teacher = teacher;
      next();
    } catch (error) {
      console.error("Error fetching teacher:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

module.exports = { authenticateTeacher };
