const express = require('express');
const router = express.Router();
const db = require('../db'); // ตรวจสอบให้แน่ใจว่า '../db' เป็นไฟล์ที่ส่งออก db instance
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles } = require('../middleware/auth'); // สร้างไฟล์ middleware/auth.js ตามขั้นตอนถัดไป

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'ต้องระบุชื่อผู้ใช้และรหัสผ่าน' });
    }

    // ค้นหาผู้ใช้จากตาราง users พร้อม join กับ roles เพื่อรับ role_name
    const user = await db('users')
      .join('roles', 'users.role_id', 'roles.id')
      .where('users.username', username)
      .select(
        'users.id',
        'users.username',
        'users.password',  // ในระบบจริงควรใช้การ hash รหัสผ่านและตรวจสอบ hash
        'users.email',
        'roles.role_name',
        'roles.id as role_id'
      )
      .first();

    if (!user) {
      return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // ตรวจสอบรหัสผ่าน (ในตัวอย่างนี้ สมมุติว่าเป็นจริง)
    // ในระบบ production ควรใช้ bcrypt.compare(password, user.password) เพื่อตรวจสอบรหัสผ่าน
    // if (!bcrypt.compareSync(password, user.password)) { ... }

    // เตรียมข้อมูลเพิ่มเติมตาม role ของผู้ใช้
    let additionalData = {};
    const role = user.role_name.toLowerCase();
    if (role === 'teacher') {
      // ดึงข้อมูลเพิ่มเติมสำหรับ teacher จากตาราง teachers
      const teacher = await db('teachers')
        .where({ user_id: user.id })
        .first();
      additionalData = { teacher };
    } else if (role === 'student') {
      // ดึงข้อมูลเพิ่มเติมสำหรับ student จากตาราง students
      const student = await db('students')
        .where({ user_id: user.id })
        .first();
      additionalData = { student };
    } else if (role === 'office') {
      // ดึงข้อมูลเพิ่มเติมสำหรับ officer จากตาราง officers (ถ้ามี)
      const officer = await db('offices')
        .where({ user_id: user.id })
        .first();
      additionalData = { officer };
    } else if (role === 'admin') {
      // สำหรับ admin อาจไม่ต้องดึงข้อมูลเพิ่มเติม หรือดึงข้อมูลอื่นๆ ที่เกี่ยวข้อง
      additionalData = { admin: { id: user.id, username: user.username, email: user.email } };
    }

    // สร้าง token โดยใช้ข้อมูลพื้นฐานของผู้ใช้
    const token = jwt.sign(
      { id: user.id, username: user.username, role_name: user.role_name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ส่ง response พร้อมข้อมูล token, role และข้อมูลเพิ่มเติมตาม role
    res.json({ 
      message: 'เข้าสู่ระบบสำเร็จ', 
      token,
      role_name: user.role_name,
      ...additionalData
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: 'Error logging in', error });
  }
});



// GET /users - ดึงข้อมูลผู้ใช้ทั้งหมด (ต้องการ JWT)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  console.log('GET /users'); // สำหรับการดีบัก
  try {
    const users = await db('users')
      .join('roles', 'users.role_id', 'roles.id')
      .select(
        'users.id',
        'users.username',
        'users.email',
        'roles.role_name',
        'users.created_at',
        'users.updated_at'
      );

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// GET /users/:id - ดึงข้อมูลผู้ใช้ตาม ID (ต้องการ JWT)
router.get('/:id', authenticateToken, async (req, res) => {
  console.log(`GET /users/${req.params.id}`); // สำหรับการดีบัก
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID ผู้ใช้ไม่ถูกต้อง' });
    }

    const user = await db('users')
      .join('roles', 'users.role_id', 'roles.id')
      .where('users.id', userId)
      .select(
        'users.id',
        'users.username',
        'users.email',
        'roles.role_name',
        'users.created_at',
        'users.updated_at'
      )
      .first();

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// ตัวอย่าง API: POST /users
router.post('/', async (req, res) => {
  console.log('POST /users ถูกเรียก');
  try {
    const { username, email, password, role_id } = req.body;

    // ตรวจสอบให้แน่ชัดว่ามี username, password และ email (email ต้องไม่ว่าง)
    if (!username || !password || !email || email.trim() === '') {
      return res.status(400).json({ 
        message: 'ต้องระบุชื่อผู้ใช้, รหัสผ่าน และอีเมล (email ต้องไม่ว่าง)' 
      });
    }

    // ตรวจสอบว่า username ยังไม่ได้ถูกใช้งาน
    const existingUser = await db('users').where({ username }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
    }

    // ตรวจสอบว่า role_id มีอยู่จริงในตาราง roles
    const role = await db('roles').where({ id: role_id }).first();
    if (!role) {
      return res.status(400).json({ message: 'role_id ที่ระบุไม่ถูกต้อง' });
    }

    // แฮชรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);
    let userId;

    // ใช้ Transaction เพื่อ Insert ข้อมูลลงในตาราง users และตารางเพิ่มเติม (students, teachers, offices)
    await db.transaction(async trx => {
      const insertedIds = await trx('users').insert({
        username,
        email, // ส่งค่า email ที่ได้รับจาก req.body (ต้องมีค่า)
        password: hashedPassword,
        role_id,
      });
      userId = insertedIds[0];

      // ตรวจสอบ role_id เพื่อ Insert ข้อมูลในตารางเพิ่มเติมตามบทบาท
      // จากฐานข้อมูลของคุณ:
      // Student → role_id = 4, Teacher → role_id = 3, Office → role_id = 2
      if (parseInt(role_id, 10) === 4) {
        await trx('students').insert({ user_id: userId, address_id: 1 });
      } else if (parseInt(role_id, 10) === 3) {
        await trx('teachers').insert({ user_id: userId, address_id: 1 });
      } else if (parseInt(role_id, 10) === 2) {
        await trx('offices').insert({ user_id: userId, address_id: 1 });
      }
      // สำหรับ Admin (role_id = 1) ไม่ต้อง insert ข้อมูลเพิ่มเติม
    });

    // ดึงข้อมูลผู้ใช้ที่เพิ่งเพิ่มมา (join กับ roles)
    const newUser = await db('users')
      .join('roles', 'users.role_id', 'roles.id')
      .where('users.id', userId)
      .select(
        'users.id',
        'users.username',
        'users.email',
        'roles.role_name',
        'users.created_at',
        'users.updated_at'
      )
      .first();

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user', error });
  }
});


// PUT /users/:id - อัพเดทข้อมูลผู้ใช้ (ต้องการ JWT)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  console.log(`PUT /users/${req.params.id} ถูกเรียก`);
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID ผู้ใช้ไม่ถูกต้อง' });
    }
    // เปลี่ยนจากการรับ username เป็น email
    const { username, password, role_id } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'ต้องระบุอีเมลผู้ใช้' });
    }
    // ตรวจสอบ role_id ว่ามีอยู่จริงในตาราง roles (ถ้ามีการเปลี่ยนแปลง)
    if (role_id) {
      const role = await db('roles').where({ id: role_id }).first();
      if (!role) {
        return res.status(400).json({ message: 'role_id ที่ระบุไม่ถูกต้อง' });
      }
    }
    // เตรียมข้อมูลที่จะ update โดยใช้ email
    const updateData = { username, role_id, updated_at: db.fn.now() };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    // ทำการ update ข้อมูลผู้ใช้
    const updated = await db('users').where({ id: userId }).update(updateData);
    if (updated) {
      // ดึงข้อมูลผู้ใช้ที่อัพเดทแล้วกลับมา
      const updatedUser = await db('users')
        .join('roles', 'users.role_id', 'roles.id')
        .where('users.id', userId)
        .select(
          'users.id',
          'users.username',
          'users.email',
          'roles.role_name',
          'users.created_at',
          'users.updated_at'
        )
        .first();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user', error });
  }
});


router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  console.log(`DELETE /users/${req.params.id} ถูกเรียก`);
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID ผู้ใช้ไม่ถูกต้อง' });
    }

    await db.transaction(async trx => {
      // 🔍 ค้นหา student_id ที่เชื่อมโยงกับ user_id
      const student = await trx('students').where({ user_id: userId }).first();

      if (student) {
        console.log(`พบ student_id: ${student.student_id} ที่เชื่อมกับ user_id: ${userId}`);

        // 🔥 ลบข้อมูลใน home_visits ที่อ้างอิง student_id (ต้องทำก่อน)
        const deletedVisits = await trx('home_visits')
          .where({ student_id: student.student_id })
          .del();
        
        console.log(`✅ ลบ home_visits ของ student_id: ${student.student_id}, ลบไป ${deletedVisits} แถว`);

        // 🔄 ตรวจสอบว่าลบ home_visits สำเร็จหรือไม่
        const checkVisits = await trx('home_visits')
          .where({ student_id: student.student_id })
          .first();

        if (checkVisits) {
          throw new Error(`⚠ ไม่สามารถลบ home_visits ที่ student_id: ${student.student_id}`);
        }

        // 🔥 ลบข้อมูลของ student ออกจากตาราง students
        const deletedStudents = await trx('students').where({ user_id: userId }).del();
        console.log(`✅ ลบ students ที่ user_id: ${userId}, ลบไป ${deletedStudents} แถว`);
      }

      // 🔥 ลบผู้ใช้จากตาราง users
      const deletedUsers = await trx('users').where({ id: userId }).del();
      if (!deletedUsers) {
        throw new Error('ไม่พบผู้ใช้');
      }

      console.log(`✅ ลบ users ที่ user_id: ${userId} สำเร็จ`);
    });

    res.json({ message: `ลบผู้ใช้หมายเลข ${userId} เรียบร้อยแล้ว` });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.toString() });
  }
});




module.exports = router;
