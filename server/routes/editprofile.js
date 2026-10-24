const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth'); // ใช้ middleware สำหรับการตรวจสอบ token

router.get('/:id', async (req, res) => {
    try {
      let { id } = req.params;
      console.log("Student ID received:", id); // Debug: แสดงค่า id ที่ได้รับ
  
      // ถ้าในฐานข้อมูล student_id เป็นตัวเลข ให้แปลง id เป็น Number
      if (!isNaN(id)) {
        id = Number(id);
      }
    
      const student = await db('students')
        .select(
          'student_id',
          'full_name',
          'citizen_id',
          'education_level',
          'plan',
          'major',
          'department',
          'room'
        )
        .where({ student_id: id })
        .first();
    
      if (!student) {
        return res.status(404).json({ error: "ไม่พบข้อมูลนักเรียน" });
      }
      
      res.json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// PATCH /profileStudent/:studentId
router.patch('/:studentId', async (req, res) => {
    try {
      const { studentId } = req.params;
      
      // ตรวจสอบว่ามีนักเรียนที่มี student_id นี้หรือไม่
      const student = await db('students')
        .where({ student_id: studentId })
        .first();
  
      if (!student) {
        return res.status(404).json({ error: 'ไม่พบข้อมูลนักเรียน' });
      }
  
      // เปลี่ยนจาก avatarUrl เป็น img ก่อนอัปเดต
      const updateData = {
        full_name: req.body.full_name,
        student_id: req.body.student_id,
        education_level: req.body.education_level,
        department: req.body.department,
        room: req.body.room,
        // เปลี่ยนเป็น img หากมีการส่งรูปโปรไฟล์มา
        img: req.body.avatarUrl,
        citizen_id: req.body.citizen_id,
        plan: req.body.plan,
        major: req.body.major
      };
  
      // อัปเดตข้อมูลในฐานข้อมูล
      await db('students')
        .where({ student_id: studentId })
        .update(updateData);
  
      // ดึงข้อมูลนักเรียนที่อัปเดตแล้วกลับมา
      const updatedStudent = await db('students')
        .where({ student_id: studentId })
        .first();
  
      res.json(updatedStudent);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  

module.exports = router;

