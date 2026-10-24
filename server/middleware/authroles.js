// middleware/authorize.js
const autheRoles = (...allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role_name;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'คุณไม่มีสิทธิ์เข้าถึงทรัพยากรนี้' });
      }
      next();
    };
  };
  
  module.exports = { autheRoles };
  