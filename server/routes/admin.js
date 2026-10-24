const express = require('express');
const router = express.Router();
const db = require('../db'); // ตรวจสอบให้แน่ใจว่า '../db' เป็นไฟล์ที่ส่งออก db instance
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles } = require('../middleware/auth'); // สร้างไฟล์ middleware/auth.js ตามขั้นตอนถัดไป


// API สำหรับดึงผู้ใช้งานที่มี role "Student" พร้อมข้อมูลจากตาราง students
router.get('/students', async (req, res) => {
    try {
      const students = await db('users')
        .join('roles', 'users.role_id', 'roles.id')
        .join('students', 'users.id', 'students.user_id')
        .where('roles.role_name', 'Student')
        .select(
          'users.id as user_id',
          'users.username',
          'users.email',
          'roles.role_name',
          'users.created_at',
          'users.updated_at',
          'students.student_id',
          'students.full_name',
          'students.citizen_id',
          'students.education_level',
          'students.plan',
          'students.major',
          'students.department',
          'students.room'
        );
          
      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: 'Error fetching students', error });
    }
  });

  // API สำหรับดึงผู้ใช้งานที่มี role "Student" พร้อมข้อมูลจากตาราง students
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await db('users')
      .join('roles', 'users.role_id', 'roles.id')
      .join('teachers', 'users.id', 'teachers.user_id')
      .where('roles.role_name', 'Teacher')
      .select(
        'users.id as user_id',
        'users.username',
        'users.email',
        'roles.role_name',
        'users.created_at',
        'users.updated_at',
        'teachers.full_name',
        'teachers.advisor',
        'teachers.phone',
        'teachers.email',
      );
        
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: 'Error fetching teachers', error });
  }
});


  // API สำหรับดึงผู้ใช้งานที่มี role "Student" พร้อมข้อมูลจากตาราง students
  router.get('/offices', async (req, res) => {
    try {
      const offices = await db('users')
        .join('roles', 'users.role_id', 'roles.id')
        .join('offices', 'users.id', 'offices.user_id')
        .where('roles.role_name', 'Office')
        .select(
          'users.id as user_id',
          'users.username',
          'users.email',
          'roles.role_name',
          'users.created_at',
          'users.updated_at',
          'offices.office_name',
          'offices.phone',
          'offices.email',
        );
          
      res.status(200).json(offices);
    } catch (error) {
      console.error("Error fetching offices:", error);
      res.status(500).json({ message: 'Error fetching offices', error });
    }
  });
  
module.exports = router;
