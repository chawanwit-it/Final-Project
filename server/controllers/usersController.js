// controllers/usersController.js

// ตัวอย่างข้อมูลผู้ใช้ (ในกรณีนี้ยังไม่ได้เชื่อมต่อกับฐานข้อมูล)
let users = [
    { id: 1, name: 'สมชาย' },
    { id: 2, name: 'สมหญิง' },
  ];
  
  // ดึงผู้ใช้ทั้งหมด
  exports.getAllUsers = (req, res) => {
    res.json(users);
  };
  
  // ดึงผู้ใช้ตาม ID
  exports.getUserById = (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }
  };
  
  // สร้างผู้ใช้ใหม่
  exports.createUser = (req, res) => {
    const newUser = req.body;
    users.push(newUser); // ในกรณีนี้เพิ่มในอาร์เรย์ (ควรบันทึกในฐานข้อมูลจริง)
    res.status(201).json(newUser);
  };
  
  // อัพเดทข้อมูลผู้ใช้
  exports.updateUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    let user = users.find(u => u.id === userId);
    if (user) {
      user.name = updatedUser.name;
      res.json(user);
    } else {
      res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }
  };
  
  // ลบผู้ใช้
  exports.deleteUser = (req, res) => {
    const userId = parseInt(req.params.id);
    users = users.filter(u => u.id !== userId);
    res.json({ message: `ลบผู้ใช้หมายเลข ${userId} เรียบร้อยแล้ว` });
  };
  