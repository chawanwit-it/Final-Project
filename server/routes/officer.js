const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth'); // ใช้ middleware สำหรับการตรวจสอบ token


// API สำหรับดึงข้อมูลภาคเรียนทั้งหมด
router.get('/getAll', async (req, res) => {
    try {
        const semesters = await db('semesters').select('*');

        // แปลงเวลา start_date และ end_date เป็นเวลาประเทศไทย (UTC+7)
        const formattedSemesters = semesters.map((semester) => {
            const startDate = new Date(semester.start_date);
            const endDate = new Date(semester.end_date);

            // แปลงเวลาเป็น UTC+7 (ประเทศไทย)
            startDate.setHours(startDate.getHours() + 7);
            endDate.setHours(endDate.getHours() + 7);

            return {
                ...semester,
                start_date: startDate.toISOString().slice(0, 19).replace('T', ' '),  // รูปแบบ 'YYYY-MM-DD HH:mm:ss'
                end_date: endDate.toISOString().slice(0, 19).replace('T', ' '),
            };
        });

        res.status(200).json(formattedSemesters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลภาคเรียน' });
    }
});
// API สำหรับเพิ่มภาคเรียน
router.post('/add', async (req, res) => {
    const { name, start_date, end_date } = req.body;

    // ตรวจสอบว่ามีการส่งข้อมูลครบถ้วนหรือไม่
    if (!name || !start_date || !end_date) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    try {
        // เพิ่มข้อมูลภาคเรียน
        const [semesterId] = await db('semesters').insert({
            name,
            start_date,
            end_date
        });

        return res.status(201).json({
            message: 'เพิ่มภาคเรียนสำเร็จ',
            semester_id: semesterId
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มภาคเรียน' });
    }
});

// API สำหรับดึงไอดีล่าสุดของภาคเรียน
router.get('/semesters/latest', async (req, res) => {
    try {
      const latestSemester = await db('semesters').orderBy('id', 'desc').first();
      
      if (latestSemester) {
        res.status(200).json(latestSemester);
      } else {
        res.status(404).json({ message: 'ไม่พบข้อมูลภาคเรียน' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
  });


  router.get('/home_visits/:semester_id', async (req, res) => {
        const semesterId = req.params.semester_id;
      
        try {
          // ตรวจสอบว่า semester_id ถูกส่งมาใน URL และไม่เป็นค่าว่าง
          if (!semesterId) {
            return res.status(400).json({ error: 'กรุณาระบุ semester_id' });
          }
      
          // ดึงข้อมูลการเยี่ยมบ้านจากตาราง home_visits โดยกรองตาม semester_id
          const homeVisits = await db('home_visits')
            .where('semester_id', semesterId)  // กรองตาม semester_id
            .join('students', 'home_visits.student_id', '=', 'students.id')  // เชื่อมกับตาราง students
            .join('teachers', 'home_visits.teacher_id', '=', 'teachers.id')  // เชื่อมกับตาราง teachers
            .join('semesters', 'home_visits.semester_id', '=', 'semesters.id') // เชื่อมกับตาราง semesters
            .select(
              'home_visits.id',
              'home_visits.visit_id',
              'students.full_name AS student_name',  // เปลี่ยนจาก 'students.name' เป็น 'students.full_name'
              'students.room AS student_room',
              'students.phone AS student_phone',
              'teachers.full_name AS teacher_name',  // เปลี่ยนจาก 'teachers.name' เป็น 'teachers.full_name'
              'home_visits.visit_status',
              'home_visits.visit_date',
              'semesters.name AS semester_name'          // ดึงชื่อภาคเรียนจากตาราง semesters

            );
      
          if (homeVisits.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลการเยี่ยมบ้านสำหรับภาคเรียนนี้' });
          }
      
          // ส่งข้อมูลการเยี่ยมบ้านกลับไป
          res.status(200).json(homeVisits);
        } catch (error) {
          console.error('Error fetching home visits:', error);
          res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการเยี่ยมบ้าน' });
        }
      });


      router.get('/report/:visit_id' ,authenticateToken, async (req, res) => {
        try {
          const { visit_id } = req.params;
          if (!visit_id) {
            return res.status(400).json({ error: 'visit_id จำเป็นต้องระบุ' });
          }
      
          // ดึงข้อมูลรายงานจากตาราง home_visits พร้อม join กับ students เพื่อดึงข้อมูลนักศึกษา
          const report = await db('home_visits as hv')
            .select(
              'hv.visit_id',
              'hv.visit_date',
              'hv.visit_status',
              'hv.environment_condition',
              'hv.student_behavior',
              'hv.family_finance',
              'hv.scholarship_need',
              'hv.positive_behavior',
              'hv.problem_solving',
              'hv.parent_feedback',
              'hv.suggestion',
              'hv.image',
              's.full_name as student_name',
              's.student_id as student_number',
              's.room as student_room',
              's.phone as student_phone'
            )
            .join('students as s', 'hv.student_id', 's.id')
            .where('hv.visit_id', visit_id)
            .first();
      
          if (!report) {
            return res.status(404).json({ error: 'ไม่พบรายงานการเยี่ยมบ้านสำหรับ visit_id นี้' });
          }
      
          // ประมวลผลคอลัมน์ image:
          // หากมีค่าใน report.image (เป็นสตริง comma-separated) ให้แปลงเป็น Array ของ URL รูปภาพ
          let images = [];
          if (report.image && report.image.trim() !== "") {
            images = report.image.split(',').map(filename => filename.trim()).filter(filename => filename !== "");
            // สมมุติว่าไฟล์ภาพถูกเก็บในโฟลเดอร์ uploads และมี base URL ดังนี้:
            const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
            images = images.map(filename => baseUrl + filename);
          }
      
          // สร้าง object สำหรับส่งกลับในรูปแบบที่หน้า ViewReport.vue คาดหวัง
          const response = {
            student_name: report.student_name,
            student_number: report.student_number,
            student_room: report.student_room,
            student_phone: report.student_phone,
            visit_date: report.visit_date,
            visit_status: report.visit_status,
            environment_condition: report.environment_condition,
            student_behavior: report.student_behavior,
            family_finance: report.family_finance,
            scholarship_need: report.scholarship_need,
            positive_behavior: report.positive_behavior,
            problem_solving: report.problem_solving,
            parent_feedback: report.parent_feedback,
            suggestion: report.suggestion,
            images: images
          };
      
          return res.json(response);
        } catch (error) {
          console.error('Error GET /teacher/report/:visit_id:', error);
          return res.status(500).json({ error: error.message });
        }
      });
      

module.exports = router;

