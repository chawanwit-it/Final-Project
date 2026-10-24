require('dotenv').config(); // โหลด environment variables
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');
const port = process.env.PORT || 7000;

// Middleware สำหรับแปลงข้อมูลเป็น JSON
app.use(express.json());
app.use(cors())
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// นำเข้า routes
const userRoutes = require('./routes/User');
const studentRoutes = require('./routes/student');
const uploadRouter = require('./routes/upload');
const teacherRoutes = require('./routes/teacher');
const officerRoutes = require('./routes/officer');
const adminRoutes = require('./routes/admin');
const editprofileRoutes = require('./routes/editprofile');


app.use('/users', userRoutes); 
app.use('/students', studentRoutes); 
app.use('/teacher', teacherRoutes); 
app.use('/upload', uploadRouter);
app.use('/officer', officerRoutes);
app.use('/admin', adminRoutes);
app.use('/profile', editprofileRoutes);




// Middleware สำหรับการจัดการ 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'ไม่พบเส้นทางที่ร้องขอ' });
});

// Middleware สำหรับการจัดการข้อผิดพลาดทั่วไป
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
});


// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`APIIIIIIIIIIIIIIIIIIIIIIIIIIIIII http://localhost:${port}`);
});
