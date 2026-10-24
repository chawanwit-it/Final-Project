const express = require('express');
const router = express.Router();
const db = require('../db'); // ตรวจสอบให้แน่ใจว่า '../db' เป็นไฟล์ที่ส่งออก knex instance
const path = require('path');
const { authenticateTeacher, authorizeRoles } = require('../middleware/authTeacher'); // สร้างไฟล์ middleware/authTeacher.js ตามขั้นตอนถัดไป
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const { authenticateToken } = require('../middleware/auth'); // ใช้ middleware สำหรับการตรวจสอบ token

router.get('/student', async (req, res) => {
  try {
    // Query ดึงข้อมูลครูพร้อมกับนักเรียน โดยใช้ LEFT JOIN
    const rows = await db('teachers')
      .leftJoin('students', 'teachers.id', 'students.advisor_id')
      .select(
        'teachers.id as teacher_id',
        'teachers.full_name as teacher_name',
        'teachers.phone as teacher_phone',
        'teachers.email as teacher_email',
        'students.id as student_id',
        'students.room as student_room',
        'students.full_name as student_name',
        'students.student_id as student_number'
      )
      .orderBy('teachers.id');

    // จัดกลุ่มข้อมูลโดยที่แต่ละครูจะมี array ของนักเรียน
    const teacherMap = {};
    rows.forEach(row => {
      // ถ้ายังไม่มีข้อมูลของครูใน teacherMap ให้สร้าง object ใหม่สำหรับครูคนนั้น
      if (!teacherMap[row.teacher_id]) {
        teacherMap[row.teacher_id] = {
          teacher_id: row.teacher_id,
          teacher_name: row.teacher_name,
          teacher_phone: row.teacher_phone,
          teacher_email: row.teacher_email,
          students: []
        };
      }
      // หากมีข้อมูลนักเรียน (student_id ไม่เป็น null) ให้เพิ่มเข้าไปใน array ของนักเรียน
      if (row.student_id) {
        teacherMap[row.teacher_id].students.push({
          student_id: row.student_id,
          student_name: row.student_name,
          student_number: row.student_number,
          student_room: row.student_room
        });
      }
    });

    // แปลง object เป็น array
    const result = Object.values(teacherMap);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET: ดึงรายงานการเยี่ยมบ้านตาม visit_id
router.get('/report/:visit_id', authenticateToken, async (req, res) => {
  try {
    const { visit_id } = req.params;
    if (!visit_id) {
      return res.status(400).json({ error: 'visit_id จำเป็นต้องระบุ' });
    }

    // ดึงข้อมูลรายงานจากตาราง home_visits พร้อม join กับ students
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
        'hv.improvement_behavior', // เพิ่มตรงนี้
        'hv.image', // รูปภาพ (อาจเป็น comma-separated string)
        's.full_name as student_name',
        's.student_id as student_number',
        's.room as student_room',
        's.phone as student_phone',
        'sem.name as semester_name' // ดึงชื่อภาคเรียน
      )
      .join('students as s', 'hv.student_id', 's.id')
      .join('semesters as sem', 'hv.semester_id', 'sem.id') // join กับตาราง semesters
      .where('hv.visit_id', visit_id)
      .first();

    if (!report) {
      return res.status(404).json({ error: 'ไม่พบรายงานการเยี่ยมบ้านสำหรับ visit_id นี้' });
    }

    // ถ้ามีค่าใน hv.image (เป็นสตริง comma-separated) ให้แปลงเป็น Array ของ URL รูปภาพ
    let images = [];
    if (report.image && report.image.trim() !== "") {
      images = report.image.split(',').map(filename => filename.trim()).filter(filename => filename !== "");
      // สมมุติว่าไฟล์ภาพถูกเก็บในโฟลเดอร์ uploads และมี base URL ดังนี้:
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
      images = images.map(filename => baseUrl + filename);
    }

    // สร้าง object สำหรับส่งกลับ
    const responseData = {
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
      improvement_behavior: report.improvement_behavior,
      problem_solving: report.problem_solving,
      parent_feedback: report.parent_feedback,
      suggestion: report.suggestion,
      semester_name: report.semester_name,
      images: images
    };

    return res.json(responseData);
  } catch (error) {
    console.error('Error GET /teacher/report/:visit_id:', error);
    return res.status(500).json({ error: error.message });
  }
});

// สร้าง API endpoint ใหม่เพื่อดึงเฉพาะคอลัมน์ name จากตาราง semesters
router.get('/semester-names', async (req, res) => {
  try {
    // ดึงข้อมูลชื่อภาคเรียนจาก record ล่าสุด
    const latestSemester = await db('semesters')
      .orderBy('id', 'desc') // สมมุติว่า record ล่าสุดมี id สูงสุด
      .select('name')
      .first(); // ดึงแค่ record แรกจากผลลัพธ์

    res.status(200).json(latestSemester);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/students', async (req, res) => {
  try {
    // JOIN teachers กับ students เหมือนเดิม
    // เพิ่ม db.raw() เป็น Subquery หา visit_status ล่าสุดจาก home_visits
    const rows = await db('teachers')
      .leftJoin(
        'students',
        db.raw('FIND_IN_SET(students.room, teachers.advisor) > 0')
      )
      .select(
        'teachers.id as teacher_id',
        'teachers.full_name as teacher_name',
        'teachers.phone as teacher_phone',
        'teachers.email as teacher_email',
        'teachers.advisor as teacher_advisor',
        'students.id as student_id',
        'students.room as student_room',
        'students.full_name as student_name',
        'students.student_id as student_number',
        'students.phone as student_phone',
        'students.is_completed as is_completed', // ✅ เพิ่ม is_completed
        
        // ส่วนสำคัญ: Subquery ดึง visit_status ล่าสุดของนักเรียนแต่ละคน
        db.raw(`
          (
            SELECT hv.visit_status
            FROM home_visits hv
            WHERE hv.student_id = students.id
            ORDER BY hv.visit_date DESC
            LIMIT 1
          ) as visit_status
        `),
        // Subquery ดึง semester_name โดย join home_visits กับ semesters
        db.raw(`
          (
            SELECT s.name
            FROM home_visits hv
            JOIN semesters s ON hv.semester_id = s.id
            WHERE hv.student_id = students.id
            ORDER BY hv.visit_date DESC
            LIMIT 1
          ) as semester_name
        `)
        
      )
      .orderBy('teachers.id');

    // จัดกลุ่ม: teacher -> students
    const teacherMap = {};
    rows.forEach(row => {
      // สร้าง teacher object ถ้ายังไม่มี
      if (!teacherMap[row.teacher_id]) {
        teacherMap[row.teacher_id] = {
          teacher_id: row.teacher_id,
          teacher_name: row.teacher_name,
          teacher_phone: row.teacher_phone,
          teacher_email: row.teacher_email,
          teacher_advisor: row.teacher_advisor,
          students: []
        };
      }

      // เพิ่ม student ถ้า row.student_id ไม่ใช่ null (มี student จริง)
      if (row.student_id) {
        teacherMap[row.teacher_id].students.push({
          student_id: row.student_id,
          student_name: row.student_name,
          student_number: row.student_number,
          student_room: row.student_room,
          student_phone: row.student_phone,
          semester_name: row.semester_name, // ข้อมูลชื่อภาคเรียนจาก subquery

          // ถ้า visit_status เป็น null ให้กำหนด "ยังไม่เยี่ยม"
          visit_status: row.visit_status || "ยังไม่เยี่ยม",
        });
      }
    });

    // เปลี่ยนจาก object เป็น array ก่อนส่งออก
    const result = Object.values(teacherMap);
    return res.json(result);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * API สำหรับดูรายงานการเยี่ยมบ้าน (View Report)
 * GET /teacher/home_visits/:visit_id
 */
router.get("/view_home_visits/:visit_id", async (req, res) => {
  try {
    const { visit_id } = req.params;
    // ดึงข้อมูลรายงานจาก home_visits โดยใช้ visit_id
    const report = await db("home_visits")
      .where({ visit_id: visit_id.trim() })
      .first();

    if (!report) {
      return res.status(404).json({ error: "Home visit report not found" });
    }

    // ดึงข้อมูลรูปภาพจาก visit_images โดยใช้ home_visits.id เป็น FK
    const images = await db("visit_images").where({ visit_id: report.id });

    // ดึงข้อมูล feedback จาก visit_feedback โดยใช้ home_visits.id เป็น FK
    const feedback = await db("visit_feedback").where({ visit_id: report.id }).first();

    // ดึงข้อมูลนักศึกษาจาก students โดยใช้ student_id จาก report
    const student = await db("students")
      .where({ id: report.student_id })
      .first();

    // รวมข้อมูลเข้าด้วยกัน
    report.visit_images = images; // array ของภาพ
    report.visit_feedback = feedback; // object หรือ null
    report.student = student || {}; // ข้อมูลนักศึกษา

    return res.json(report);
  } catch (error) {
    console.error("Error fetching home visit report:", error);
    return res.status(500).json({ error: error.message });
  }
});

//นักเรียนที่เยี่ยมบ้านเรียบร้อยหน้ารายงาน
router.get('/visited-students', async (req, res) => {
  try {
    // ดึงข้อมูลนักเรียนที่มี visit_status ล่าสุดเท่ากับ "เยี่ยมบ้านแล้ว"
    const students = await db('students')
      .select(
        'students.id as student_id',
        'students.full_name as student_name',
        'students.student_id as student_number',
        'students.room as student_room',
        'students.phone as student_phone',
        // ดึง visit_status ล่าสุด
        db.raw(`
          (
            SELECT hv.visit_status
            FROM home_visits hv
            WHERE hv.student_id = students.id
            ORDER BY hv.visit_date DESC
            LIMIT 1
          ) as visit_status
        `),
        // ดึง visit_id ล่าสุด
        db.raw(`
          (
            SELECT hv.visit_id
            FROM home_visits hv
            WHERE hv.student_id = students.id
            ORDER BY hv.visit_date DESC
            LIMIT 1
          ) as visit_id
        `),
        // ดึง image ล่าสุด (รูปภาพ)
        db.raw(`
          (
            SELECT hv.image
            FROM home_visits hv
            WHERE hv.student_id = students.id
            ORDER BY hv.visit_date DESC
            LIMIT 1
          ) as image
        `)
      )
      // เงื่อนไข: ให้เฉพาะนักเรียนที่มี visit_status ล่าสุดเท่ากับ "เยี่ยมบ้านแล้ว"
      .whereRaw(`
        (
          SELECT hv.visit_status
          FROM home_visits hv
          WHERE hv.student_id = students.id
          ORDER BY hv.visit_date DESC
          LIMIT 1
        ) = ?
      `, ['เยี่ยมบ้านแล้ว']);

    res.json(students);
  } catch (err) {
    console.error('Error GET /visited-students:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/report/:visit_id', async (req, res) => {
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

// API สำหรับแก้ไขข้อมูลการเยี่ยมบ้าน (PATCH /teacher/edit/home_visits/:id)
router.patch("/edit/home_visits/:id", async (req, res) => {
  try {
    const { id } = req.params; // id ของ record ในตาราง home_visits
    // รับข้อมูลจาก req.body (จากฟอร์มที่ส่งมาจาก Front-end)
    const {
      environment_condition,
      student_behavior,
      family_finance,
      scholarship_need,
      positive_behavior,
      problem_solving,
      improvement_behavior,
      suggestion,
      parent_feedback,
      image, // ค่านี้เป็นสตริงที่คั่นด้วย comma (ชื่อไฟล์รูป)
      visit_status,
    } = req.body;

    // เตรียม payload สำหรับ update
    const payload = {
      environment_condition: environment_condition || null,
      student_behavior: student_behavior || null,
      family_finance: family_finance || null,
      scholarship_need: scholarship_need || null,
      positive_behavior: positive_behavior || null,
      problem_solving: problem_solving || null,
      improvement_behavior: improvement_behavior || null,
      suggestion: suggestion || null,
      parent_feedback: parent_feedback || null,
      image: image || null,
      ...(visit_status ? { visit_status } : {}), // update visit_status หากมีส่งมา
      updated_at: new Date(), // อัปเดต timestamp
    };

    // ใช้ Knex (หรือ db instance) ในการ update ตาราง home_visits
    const affectedRows = await db("home_visits").where({ id }).update(payload);

    if (affectedRows) {
      return res.status(200).json({
        message: "แก้ไขข้อมูลรายงานการเยี่ยมบ้านเรียบร้อยแล้ว",
      });
    } else {
      return res.status(404).json({
        message: "ไม่พบรายงานการเยี่ยมบ้านที่ต้องการแก้ไข",
      });
    }
  } catch (error) {
    console.error("Error updating home visit report:", error);
    return res.status(500).json({ error: error.message });
  }
});


// API สำหรับบันทึกข้อมูลการเยี่ยมบ้าน (POST /insert/home_visits)
router.post("/insert/home_visits", async (req, res) => {
  try {
    console.log("Received payload:", req.body);  // Log ค่าที่ได้รับ
    const {
      visit_id,
      student_id,
      teacher_id,
      visit_date,
      environment_condition,
      student_behavior,
      family_finance,
      scholarship_need,
      positive_behavior,
      problem_solving,
      suggestion,
      image,
      visit_status
    } = req.body;

    const payload = {
      visit_id,
      student_id,
      teacher_id,
      visit_date,
      environment_condition: environment_condition || null,
      student_behavior: student_behavior || null,
      family_finance: family_finance || null,
      scholarship_need: scholarship_need || null,
      positive_behavior: positive_behavior || null,
      problem_solving: problem_solving || null,
      suggestion: suggestion || null,
      image: image || null,
      ...(visit_status ? { visit_status } : {})
    };

    console.log("Payload to insert:", payload); // Log payload ที่จะ insert

    const [insertedId] = await db("home_visits").insert(payload);

    console.log("Insert successful, insertedId:", insertedId);
    return res.status(201).json({
      message: "Home visit report inserted successfully",
      visit_id,
      id: insertedId
    });
  } catch (error) {
    console.error("Error inserting home visit report:", error);
    return res.status(500).json({ error: error.message });
  }
});

// API สำหรับแก้ไขข้อมูลการเยี่ยมบ้าน (PATCH /edit/home_visits/:visit_id)
router.patch("/1edit/home_visits/:visit_id", async (req, res) => {
  try {
    const { visit_id } = req.params;
    console.log("Received visit_id from params:", visit_id);

    // รับข้อมูลจาก body (เพิ่ม improvement_behavior เข้าไป)
    const {
      environment_condition,
      student_behavior,
      family_finance,
      scholarship_need,
      positive_behavior,
      problem_solving,
      suggestion,
      image,           // สำหรับไฟล์ภาพ (อาจเป็น URL หรือ comma-separated string หากมีหลายรูป)
      visit_status,
      parent_feedback,  // ข้อเสนอแนะจากผู้ปกครอง
      improvement_behavior  // ฟิลด์ใหม่ที่เพิ่มเข้ามา
    } = req.body;

    const computedStudentBehavior =
    Array.isArray(student_behavior)
      ? student_behavior.join(", ")
      : typeof student_behavior === "string"
        ? student_behavior.trim()
        : "";
  
        const updatePayload = {
          environment_condition: (environment_condition !== undefined && environment_condition !== "") ? environment_condition : null,
          student_behavior: computedStudentBehavior, // ใช้ computedStudentBehavior ที่คืนเป็น string (อาจเป็น empty string)
          family_finance: (family_finance !== undefined && family_finance !== "") ? family_finance : null,
          scholarship_need: (scholarship_need !== undefined && scholarship_need !== "") ? scholarship_need : null,
          positive_behavior: (positive_behavior !== undefined && positive_behavior !== "") ? positive_behavior : null,
          problem_solving: (problem_solving !== undefined && problem_solving !== "") ? problem_solving : null,
          improvement_behavior: (improvement_behavior !== undefined && improvement_behavior !== "") ? improvement_behavior : null,
          suggestion: (suggestion !== undefined && suggestion !== "") ? suggestion : null,
          // image: (image !== undefined && image !== "") ? image : null,
          parent_feedback: (typeof parent_feedback === "string" && parent_feedback.trim() !== "") ? parent_feedback.trim() : null,
          ...(visit_status ? { visit_status } : {}),
            // เพิ่ม field image เฉพาะเมื่อมีค่า non-empty
  ...(image !== undefined && image !== "" ? { image } : {}),
        };
        
    

    console.log("Update payload:", updatePayload);

    // ตรวจสอบว่า route parameter เป็นตัวเลขหรือ string และแปลงเป็น Number เมื่อเป็นตัวเลข
    const receivedVisitId = visit_id.trim();
    let queryCondition = {};
    if (/^\d+$/.test(receivedVisitId)) {
      queryCondition = { id: Number(receivedVisitId) };
    } else {
      queryCondition = { visit_id: receivedVisitId };
    }
    console.log("Query condition:", queryCondition);

    // อัปเดต record ในตาราง home_visits
    const updatedCount = await db("home_visits")
      .where(queryCondition)
      .update(updatePayload);
    console.log("Updated home_visits rows count:", updatedCount);

    if (updatedCount === 0) {
      return res.status(404).json({ error: "Home visit report not found" });
    }

    return res.json({ message: "Home visit report updated successfully" });
  } catch (error) {
    console.error("Error updating home visit report:", error);
    return res.status(500).json({ error: error.message });
  }
});



router.get('/student/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1) ดึงข้อมูลนักเรียน (students + addresses)
    const student = await db('students')
      .join('addresses', 'students.address_id', 'addresses.id')
      .select(
        'students.id as id',
        'students.full_name as fullName',
        'students.nick_name as nickName',
        'students.student_id as studentID',
        'students.citizen_id as citizenID',
        'students.birth_date as birthDate',
        'students.age as age',
        'students.phone as phone',
        'addresses.house_no as houseNo',
        'addresses.village_no as villageNo',
        'addresses.road as road',
        'addresses.sub_district as subDistrict',
        'addresses.district as district',
        'addresses.province as province',
        'addresses.postal_code as postalCode',
        'students.education_level as educationLevel',
        'students.plan as plan',
        'students.major as major',
        'students.department as department',
        'students.room as room',
        'students.previous_school as previousSchool',
        'students.previous_school_district as previousSchoolDistrict',
        'students.previous_school_province as previousSchoolProvince',
        'students.family_status as familyStatus',
        'students.other_family_status as otherFamilyStatus',
        'students.total_siblings as totalSiblings',
        'students.child_order as childOrder',
        'students.current_living_with as currentLivingWith',
        'students.other_living_with as otherLivingWith',
        'students.current_residence as currentResidence',
        'students.dorm_name as dormName',
        'students.dorm_address as dormAddress',
        'students.other_residence as otherResidence',
        'students.blood_type as bloodType',
        'students.has_chronic_disease as hasChronicDisease',
        'students.chronic_disease as chronicDisease',
        'students.treatment_hospital as treatmentHospital',
        'students.treatment_district as treatmentDistrict',
        'students.treatment_province as treatmentProvince',
        'students.travel_distance as travelDistance',
        'students.travel_time as travelTime'
      )
      .where('students.id', id)
      .first();

    // หากไม่พบ student
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2) ดึงข้อมูลครอบครัวจาก families + familymembers (+ addresses ของคนในครอบครัว)
    const familyMembers = await db('families')
      .join('familymembers', 'families.id', 'familymembers.family_id')
      .leftJoin('addresses', 'familymembers.address_id', 'addresses.id')
      .select(
        'familymembers.relationship as relationship',
        'familymembers.name as name',
        'familymembers.age as age',
        'familymembers.job as job',
        'familymembers.phone as phone',
        'familymembers.salary as salary',
        'addresses.house_no as memberHouseNo',
        'addresses.village_no as memberVillageNo',
        'addresses.road as memberRoad',
        'addresses.sub_district as memberSubDistrict',
        'addresses.district as memberDistrict',
        'addresses.province as memberProvince',
        'addresses.postal_code as memberPostalCode'
      )
      .where('families.student_id', id);

    // แยกข้อมูลบิดา, มารดา และสมาชิกครอบครัวอื่นๆ
    let father = null;
    let mother = null;
    const otherFamilyMembers = [];

    familyMembers.forEach(member => {
      if (member.relationship === 'Father' || member.relationship === 'บิดา') {
        father = {
          relationship: member.relationship,
          name: member.name,
          age: member.age,
          job: member.job,
          phone: member.phone,
          salary: member.salary,
          address: member.memberHouseNo ? {
            houseNo: member.memberHouseNo,
            villageNo: member.memberVillageNo,
            road: member.memberRoad,
            subDistrict: member.memberSubDistrict,
            district: member.memberDistrict,
            province: member.memberProvince,
            postalCode: member.memberPostalCode,
          } : null
        };
      } else if (member.relationship === 'Mother' || member.relationship === 'มารดา') {
        mother = {
          relationship: member.relationship,
          name: member.name,
          age: member.age,
          job: member.job,
          phone: member.phone,
          salary: member.salary,
          address: member.memberHouseNo ? {
            houseNo: member.memberHouseNo,
            villageNo: member.memberVillageNo,
            road: member.memberRoad,
            subDistrict: member.memberSubDistrict,
            district: member.memberDistrict,
            province: member.memberProvince,
            postalCode: member.memberPostalCode,
          } : null
        };
      } else {
        otherFamilyMembers.push({
          relationship: member.relationship,
          name: member.name,
          age: member.age,
          job: member.job,
          phone: member.phone,
          salary: member.salary,
          address: member.memberHouseNo ? {
            houseNo: member.memberHouseNo,
            villageNo: member.memberVillageNo,
            road: member.memberRoad,
            subDistrict: member.memberSubDistrict,
            district: member.memberDistrict,
            province: member.memberProvince,
            postalCode: member.memberPostalCode,
          } : null
        });
      }
    });

    // ถ้าไม่มีข้อมูลบิดาหรือมารดา ให้ตั้งค่า default
    if (!father) {
      father = { name: 'Unknown Father', relationship: 'Father' };
    }
    if (!mother) {
      mother = { name: 'Unknown Mother', relationship: 'Mother' };
    }

    // 3) ดึงข้อมูลพาหนะ
    const motorcycle = await db('motorcycles')
      .select('reg_number as regNumber', 'brand', 'model', 'color')
      .where('student_id', id)
      .first();

    const car = await db('cars')
      .select('reg_number as regNumber', 'brand', 'model', 'color')
      .where('student_id', id)
      .first();

    const transportationsRaw = await db('transportations')
      .select('mode', 'description')
      .where('student_id', id);

    // กรองข้อมูล transportations ให้เหลือเฉพาะ element ที่มีค่าใช้งาน (ไม่ว่าง)
    const validTransportations = transportationsRaw.filter(t => {
      return (t.mode && t.mode.trim() !== "") || (t.description && t.description.trim() !== "");
    });

    // Mapping dictionary จากภาษาอังกฤษ (ในฐานข้อมูล) เป็นภาษาไทยสำหรับแสดงผล
    const englishToThaiMapping = {
      "Bus": "รถโดยสารประจำทาง",
      "Shuttle": "รถรับ-ส่ง",
      "Bicycle": "ปั่นจักรยาน",
      "Walking": "เดินเท้า",
      "Motorcycle": "รถจักรยานยนต์",
      "Car": "รถยนต์",
      "Other": "อื่นๆ"
    };

    // แปลงข้อมูล transportations ให้แสดงเป็นภาษาไทย
    const transportationsThai = validTransportations.map(item => ({
      mode: englishToThaiMapping[item.mode] || item.mode,
      description: item.description
    }));

    // 4) รวมผลลัพธ์เป็น JSON
    const result = {
      student: {
        ...student,
        // แปลงข้อมูล address จาก student (ซึ่งได้มาจาก join กับ addresses)
        address: {
          houseNo: student.houseNo,
          villageNo: student.villageNo,
          road: student.road,
          subDistrict: student.subDistrict,
          district: student.district,
          province: student.province,
          postalCode: student.postalCode
        }
      },
      father,
      mother,
      otherFamilyMembers,
      motorcycle,
      car
    };

    // ถ้ามีข้อมูล transportations ที่ใช้งานได้ ให้เพิ่มเข้าไปใน result
    if (transportationsThai.length > 0) {
      result.transportations = transportationsThai;
    }

    return res.json(result);
  } catch (err) {
    console.error('Error fetching student detail:', err);
    return res.status(500).json({
      message: "Error fetching student detail",
      error: err.message
    });
  }
});


// เส้นทาง GET ใหม่ ที่ไม่ซ้ำกับของที่ใช้อยู่ (เช่น '/student/detail/:id')
router.get('/student/detail/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    // ดึงข้อมูลนักเรียนจากฐานข้อมูล (หรือรวมข้อมูลเพิ่มเติมตามที่ต้องการ)
    const studentData = await db('students').where('id', studentId).first();

    if (!studentData) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลนักเรียน' });
    }

    // ตัวอย่าง: เพิ่มข้อมูลเพิ่มเติม (เช่น ข้อมูลจากตารางอื่น) ได้ที่นี่
    // const extraData = await knex('other_table').where('student_id', studentId);
    // studentData.extra = extraData;

    res.json(studentData);
  } catch (error) {
    console.error("Error retrieving student detail:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/home_visits', async (req, res) => {
  console.log('Received POST /teacher/home_visits');
  try {
    console.log("Request Body:", req.body);

    const {
      visit_id,
      student_id,
      teacher_id,
      visit_date,
      visit_status,
    } = req.body;

    if (!visit_id || !student_id || !teacher_id || !visit_date) {
      return res.status(400).json({
        error: 'ข้อมูลไม่ครบถ้วน (visit_id, student_id, teacher_id, visit_date จำเป็นต้องระบุ)',
      });
    }

    // ตรวจสอบว่า student_id และ teacher_id มีอยู่จริงในระบบ
    const studentExists = await db('students').where('id', student_id).first();
    const teacherExists = await db('teachers').where('id', teacher_id).first();
    if (!studentExists) {
      return res.status(400).json({ error: 'ไม่พบ student_id ในระบบ' });
    }
    if (!teacherExists) {
      return res.status(400).json({ error: 'ไม่พบ teacher_id ในระบบ' });
    }

    const status = visit_status || 'ยังไม่เยี่ยม';

    // ดึง semester_id ล่าสุดจากตาราง semesters
    const latestSemester = await db('semesters').orderBy('id', 'desc').first();

    if (!latestSemester) {
      return res.status(400).json({ error: 'ไม่พบภาคเรียนในระบบ' });
    }

    // ใช้ transaction ของ Knex เพื่อให้การ insert ทั้งหมดเป็น atomic
    const result = await db.transaction(async trx => {
      // Insert ลงในตาราง home_visits
      const insertedIds = await trx('home_visits').insert({
        visit_id,
        student_id,
        teacher_id,
        visit_date,
        visit_status: status,
        semester_id: latestSemester.id,  // เพิ่ม semester_id ล่าสุดลงไป
      });
      console.log("Insert result (home_visits):", insertedIds);
      const homeVisitId = insertedIds[0];
      return { homeVisitId };
    });

    return res.status(201).json({
      message: 'สร้างการเยี่ยมบ้านเรียบร้อยแล้ว',
      visit_id,
      insertedId: result.homeVisitId,
    });
  } catch (error) {
    console.error("Error creating home visit:", error);
    return res.status(500).json({ error: error.message });
  }
});


/**
 * API Endpoint: ยกเลิกการเยี่ยมบ้าน
 * DELETE /teacher/home_visits/:visit_id
 *
 * รับ visit_id จาก URL parameter แล้วลบเรคคอร์ดออกจากฐานข้อมูล
 */
router.delete('/home_visits/:visit_id', async (req, res) => {
  try {
    const { visit_id } = req.params;

    if (!visit_id) {
      return res.status(400).json({ error: 'visit_id จำเป็นต้องระบุใน URL' });
    }

    // ใช้ transaction เพื่อให้การลบข้อมูลในทุกตารางเกิดขึ้นพร้อมกัน (atomic)
    await db.transaction(async (trx) => {
      // ค้นหาแถวในตาราง home_visits ที่มี visit_id ตรงกับที่ระบุ
      const homeVisitRow = await trx('home_visits').where('visit_id', visit_id).first();

      const homeVisitPrimaryId = homeVisitRow.id;


      // ลบข้อมูลในตาราง home_visits โดยใช้ visit_id ที่ระบุ
      const affectedRows = await trx('home_visits').where('visit_id', visit_id).del();

      if (affectedRows === 0) {
        throw new Error('ไม่พบการเยี่ยมบ้านที่มี visit_id นี้');
      }
    });

    return res.status(200).json({ message: 'ยกเลิกการเยี่ยมบ้านเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Error deleting home visit:', error);
    return res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
});


/**
 * API Endpoint: อัปเดตสถานะการเยี่ยมบ้าน
 * PATCH /teacher/home_visits/:visit_id
 *
 * รับ visit_id จาก URL parameter และ visit_status จาก body
 * ใช้สำหรับเปลี่ยนสถานะการเยี่ยมบ้าน (เช่น เปลี่ยนเป็น "เยี่ยมบ้านแล้ว")
 */
router.patch('/home_visits/:visit_id', async (req, res) => {
  try {
    const { visit_id } = req.params;
    const { visit_status } = req.body;

    if (!visit_id || !visit_status) {
      return res.status(400).json({ error: 'visit_id และ visit_status จำเป็นต้องระบุ' });
    }

    // ตรวจสอบว่า record มีอยู่จริงหรือไม่
    const record = await db('home_visits').where('visit_id', visit_id).first();
    if (!record) {
      return res.status(404).json({ error: 'ไม่พบการเยี่ยมบ้านที่มี visit_id นี้' });
    }

    // ถ้าค่า visit_status ที่ส่งเข้ามาตรงกับที่มีอยู่แล้ว ให้ส่ง success กลับไป
    if (record.visit_status === visit_status) {
      return res.status(200).json({ message: 'สถานะการเยี่ยมบ้านอยู่ในสถานะที่ต้องการแล้ว' });
    }

    // ทำการ update
    const affectedRows = await db('home_visits')
      .where('visit_id', visit_id)
      .update({ visit_status });

    console.log("Affected rows on update:", affectedRows);

    if (affectedRows === 0) {
      // กรณี update ไม่ได้ผล
      return res.status(404).json({ error: 'ไม่สามารถอัปเดตสถานะได้ เนื่องจากไม่พบการเยี่ยมบ้านที่มี visit_id นี้' });
    }

    return res.status(200).json({ message: 'อัปเดตสถานะการเยี่ยมบ้านเรียบร้อยแล้ว' });
  } catch (error) {
    console.error("Error updating home visit:", error);
    return res.status(500).json({ error: error.message });
  }
});



module.exports = router;
