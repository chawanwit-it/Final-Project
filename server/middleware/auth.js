// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "ไม่มีโทเค็นการยืนยันตัวตน" });
  }

  jwt.verify(token, JWT_SECRET, async (err, userPayload) => {
    if (err) {
      console.error("❌ Invalid token:", err);
      return res.status(403).json({ status: "error", message: "Invalid token" });
    }
    console.log("✅ Token Decoded:", userPayload);
    req.user = userPayload;  // แนบข้อมูลผู้ใช้ที่ decode แล้วลงใน request
    next();
  });
};

/**
 * Middleware สำหรับตรวจสอบว่า role ของผู้ใช้ตรงกับที่อนุญาตหรือไม่
 * @param  {...string} allowedRoles - Array ของ role ที่อนุญาต (เช่น 'admin', 'teacher', 'student', 'officer')
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: ไม่มีข้อมูลผู้ใช้ใน request' });
    }
    // สมมุติว่าใน payload ของ token มี key 'role_name'
    const userRole = req.user.role_name ? req.user.role_name.toLowerCase() : null;
    if (!userRole || !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
