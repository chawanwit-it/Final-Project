const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const router = express.Router();
const xlsx = require('xlsx');
const { authenticateToken } = require('../middleware/auth');

// กำหนด Storage ด้วย multer.diskStorage
const storage = multer.diskStorage({
    // กำหนดโฟลเดอร์ปลายทางสำหรับเก็บไฟล์
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // ตรวจสอบให้แน่ใจว่าโฟลเดอร์นี้มีอยู่แล้ว
    },
    // กำหนดชื่อไฟล์ใหม่สำหรับไฟล์ที่อัพโหลด
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// สร้าง instance ของ multer โดยใช้ storage ที่กำหนดไว้
const upload = multer({ storage: storage });

// Route สำหรับรับไฟล์ที่อัพโหลด (ใช้ middleware upload.single สำหรับรับไฟล์ที่มี field name 'myFile')
router.post('/', upload.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.send('ไม่มีไฟล์ที่ถูกอัพโหลด');
    }
    res.send(`ไฟล์ถูกอัพโหลดเรียบร้อย: ${req.file.filename}`);
});

router.post('/:studentId/avatar', upload.single('avatar'), async (req, res) => {
    try {
      const { studentId } = req.params;
      
      // ตรวจสอบว่ามีไฟล์ที่ถูกอัปโหลดหรือไม่
      if (!req.file) {
        return res.status(400).json({ error: 'ไม่พบไฟล์ที่อัปโหลด' });
      }
  
      // สมมุติว่าเราเก็บ path ของไฟล์ไว้ในฐานข้อมูลในฟิลด์ 'img'
      // คุณอาจปรับเปลี่ยนให้เป็น URL เต็มถ้าต้องการ
      const filePath = req.file.path;
  
      // อัปเดตรูปโปรไฟล์ในฐานข้อมูล
      await db('students')
        .where({ student_id: studentId })
        .update({ img: filePath });
  
      res.json({ img: filePath });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post('/files', upload.array('myFiles', 10), async (req, res) => {
    const { visit_id } = req.body;
    if (!visit_id) {
      return res.status(400).json({ error: "visit_id จำเป็นต้องระบุ" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "ไม่มีไฟล์ที่ถูกอัปโหลด" });
    }
  
    // สร้าง comma-separated string ของชื่อไฟล์ที่อัปโหลด
    const fileNames = req.files.map(file => file.filename).join(', ');
    console.log("อัปโหลดไฟล์เสร็จแล้ว:", fileNames);
  
    try {
      // ใช้ Knex เพื่ออัปเดตคอลัมน์ image ในตาราง home_visits
      const updatedRows = await db('home_visits')
        .where({ visit_id })
        .update({ image: fileNames });
  
      if (updatedRows > 0) {
        return res.json({
          message: "ไฟล์ถูกอัปโหลดและบันทึกในฐานข้อมูลเรียบร้อย",
          fileNames
        });
      } else {
        return res.status(404).json({ error: "ไม่พบรายงานเยี่ยมบ้านที่มี visit_id นี้" });
      }
    } catch (error) {
      console.error("Error updating home_visits:", error);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูลไฟล์" });
    }
  });
  

// API สำหรับอัปโหลดไฟล์ Excel และแกะข้อมูล
router.post('/excel', upload.single('myFile'), async (req, res) => {
    try {
        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Uploaded file:', req.file);

        // อ่านไฟล์ Excel
        const workbook = xlsx.readFile(req.file.path);
        console.log('Workbook loaded:', workbook);

        const sheetName = workbook.SheetNames[0];
        console.log('Sheet name:', sheetName);

        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log('Parsed Excel data:', data);

        // ตรวจสอบว่ามีข้อมูลใน Excel หรือไม่
        if (data.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty or invalid format' });
        }

        // แทรกข้อมูลลงฐานข้อมูล
        const failedRows = [];
        const successRows = [];
        for (const row of data) {
            try {
                console.log('Inserting row:', row);
                await db('users').insert({
                    username: row.StudentId, // ตรวจสอบว่า "NationalIdCard" ตรงกับคอลัมน์ใน Excel
                    password: row.NationalIdCard,        // ตรวจสอบว่า "StudentId" ตรงกับคอลัมน์ใน Excel
                    email: `${row.StudentId}@ccollege.ac.th`,
                    role_id: 4  // ระบุ role_id ให้ถูกต้อง (ตัวอย่างใช้ 1 เป็นค่าเริ่มต้น)
                });
                successRows.push(row); // บันทึกแถวที่สำเร็จ
            } catch (error) {
                console.error('Failed to insert row:', row, error.message);
                failedRows.push({ row, error: error.message }); // เก็บแถวที่ล้มเหลวและเหตุผล
            }
        }


        res.json({
            message: 'Data processing complete',
            successCount: successRows.length, // จำนวนแถวที่สำเร็จ
            failedCount: failedRows.length,  // จำนวนแถวที่ล้มเหลว
            failedRows,                      // รายละเอียดแถวที่ล้มเหลว
            data,                            // ข้อมูลทั้งหมดจาก Excel
        });
    } catch (error) {
        console.error('Error while processing file:', error);
        res.status(500).json({ message: 'Error uploading or parsing file', error: error.message });
    }
});


// API สำหรับอัปโหลดไฟล์ Excel และแทรกข้อมูลลงในตาราง users และ students
router.post('/excel/students', upload.single('myFile'), async (req, res) => {
    try {
        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Uploaded file:', req.file);

        // อ่านไฟล์ Excel
        const workbook = xlsx.readFile(req.file.path);
        console.log('Workbook loaded:', workbook);

        const sheetName = workbook.SheetNames[0];
        console.log('Sheet name:', sheetName);

        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log('Parsed Excel data:', data);

        if (data.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty or invalid format' });
        }

        const failedRows = [];
        const successRows = [];

        for (const row of data) {
            try {
                await db.transaction(async (trx) => {  // ✅ แก้ให้ trx ถูกต้อง
                    // ตรวจสอบให้แน่ใจว่าคีย์ถูกต้อง
                    console.log('Processing row:', row);

                    // แทรกข้อมูลลงใน users
                    const insertedIds = await trx('users')
                        .insert({
                            username: row['รหัสนักศึกษา'],  // 🔹 ตรวจสอบให้ตรงกับคีย์ของ Excel
                            password: row['เลขบัตรประจำตัวประชาชน'], // 🔹 แปลงให้เป็น string และ trim ช่องว่าง
                            email: row['รหัสนักศึกษา'],
                            role_id: 4
                        })
                        .returning(['id']);  // 🔹 ใช้ ['id'] เพื่อรองรับ Postgres และ SQLite

                    const userId = insertedIds[0]?.id || insertedIds[0];

                    if (!userId) {
                        throw new Error("User insertion failed");
                    }

                    console.log(`Inserted user with id: ${userId}`);

                    // แทรกข้อมูลลงใน teachers
                    await trx('students').insert({
                        user_id: userId,
                        full_name: row['ชื่อนามสกุล'],
                        student_id: row['รหัสนักศึกษา'],
                        citizen_id: row['เลขบัตรประจำตัวประชาชน'],
                        education_level: row['กำลังศึกษาระดับชั้นของนักเรียน'],
                        plan: row['แผนการศึกษาของนักเรียน'],
                        major: row['สาขาวิชาของนักเรียน'],
                        department: row['แผนกวิชาชีพของนักเรียน'],
                        room: row['กลุ่มห้องของนักเรียน'],
                        address_id: 1
                    });

                    console.log(`Inserted student record for user id: ${userId}`);
                });

                successRows.push(row);
            } catch (error) {
                console.error('Failed to insert row:', row, error.message);
                failedRows.push({ row, error: error.message });
            }
        }

        res.json({
            message: 'Data processing complete',
            successCount: successRows.length,
            failedCount: failedRows.length,
            failedRows,
            data
        });

    } catch (error) {
        console.error('Error while processing file:', error);
        res.status(500).json({ message: 'Error uploading or parsing file', error: error.message });
    }
});

// API สำหรับอัปโหลดไฟล์ Excel และแทรกข้อมูลลงในตาราง users และ teachers
router.post('/excel/teachers', upload.single('myFile'), async (req, res) => {
    try {
        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Uploaded file:', req.file);

        // อ่านไฟล์ Excel
        const workbook = xlsx.readFile(req.file.path);
        console.log('Workbook loaded:', workbook);

        const sheetName = workbook.SheetNames[0];
        console.log('Sheet name:', sheetName);

        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log('Parsed Excel data:', data);

        if (data.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty or invalid format' });
        }

        const failedRows = [];
        const successRows = [];

        for (const row of data) {
            try {
                await db.transaction(async (trx) => {  // ✅ แก้ให้ trx ถูกต้อง
                    // ตรวจสอบให้แน่ใจว่าคีย์ถูกต้อง
                    console.log('Processing row:', row);

                    // แทรกข้อมูลลงใน users
                    const insertedIds = await trx('users')
                        .insert({
                            username: row['อีเมล'],  // 🔹 ตรวจสอบให้ตรงกับคีย์ของ Excel
                            password: String(row['โทรศัพท์ ']).trim(), // 🔹 แปลงให้เป็น string และ trim ช่องว่าง
                            email: row['อีเมล'],
                            role_id: 3
                        })
                        .returning(['id']);  // 🔹 ใช้ ['id'] เพื่อรองรับ Postgres และ SQLite

                    const userId = insertedIds[0]?.id || insertedIds[0];

                    if (!userId) {
                        throw new Error("User insertion failed");
                    }

                    console.log(`Inserted user with id: ${userId}`);

                    // แทรกข้อมูลลงใน teachers
                    await trx('teachers').insert({
                        user_id: userId,
                        full_name: row['ชื่อจริงครู'],
                        advisor: row['ที่ปรึกษาห้อง'],
                        department: row['ครูแผนก'],
                        email: row['อีเมล'],
                        phone: String(row['โทรศัพท์']).trim(),
                        address_id: 1
                    });

                    console.log(`Inserted teacher record for user id: ${userId}`);
                });

                successRows.push(row);
            } catch (error) {
                console.error('Failed to insert row:', row, error.message);
                failedRows.push({ row, error: error.message });
            }
        }

        res.json({
            message: 'Data processing complete',
            successCount: successRows.length,
            failedCount: failedRows.length,
            failedRows,
            data
        });

    } catch (error) {
        console.error('Error while processing file:', error);
        res.status(500).json({ message: 'Error uploading or parsing file', error: error.message });
    }
});


// API สำหรับอัปโหลดไฟล์ Excel และแทรกข้อมูลลงในตาราง users และ students
router.post('/excel/offices', upload.single('myFile'), async (req, res) => {
    try {
        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Uploaded file:', req.file);

        // อ่านไฟล์ Excel
        const workbook = xlsx.readFile(req.file.path);
        console.log('Workbook loaded:', workbook);

        const sheetName = workbook.SheetNames[0];
        console.log('Sheet name:', sheetName);

        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log('Parsed Excel data:', data);

        if (data.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty or invalid format' });
        }

        const failedRows = [];
        const successRows = [];

        for (const row of data) {
            try {
                await db.transaction(async (trx) => {  // ✅ แก้ให้ trx ถูกต้อง
                    // ตรวจสอบให้แน่ใจว่าคีย์ถูกต้อง
                    console.log('Processing row:', row);

                    // แทรกข้อมูลลงใน users
                    const insertedIds = await trx('users')
                        .insert({
                            username: row['อีเมล'],  // 🔹 ตรวจสอบให้ตรงกับคีย์ของ Excel
                            password: row['โทรศัพท์'] ? String(row['โทรศัพท์']).padStart(10, '0').trim() : '',

                            email: row['อีเมล'],
                            role_id: 2
                        })
                        .returning(['id']);  // 🔹 ใช้ ['id'] เพื่อรองรับ Postgres และ SQLite

                    const userId = insertedIds[0]?.id || insertedIds[0];

                    if (!userId) {
                        throw new Error("User insertion failed");
                    }

                    console.log(`Inserted user with id: ${userId}`);

                    // แทรกข้อมูลลงใน teachers
                    await trx('offices').insert({
                        user_id: userId,
                        office_name: row['ชื่อจริง'],
                        email: row['อีเมล'],
                        phone: row['โทรศัพท์'] ? String(row['โทรศัพท์']).padStart(10, '0').trim() : '',
                        address_id: 1
                    });

                    console.log(`Inserted office record for user id: ${userId}`);
                });

                successRows.push(row);
            } catch (error) {
                console.error('Failed to insert row:', row, error.message);
                failedRows.push({ row, error: error.message });
            }
        }

        res.json({
            message: 'Data processing complete',
            successCount: successRows.length,
            failedCount: failedRows.length,
            failedRows,
            data
        });

    } catch (error) {
        console.error('Error while processing file:', error);
        res.status(500).json({ message: 'Error uploading or parsing file', error: error.message });
    }
});


module.exports = router;
