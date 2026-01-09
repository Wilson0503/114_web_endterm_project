const jwt = require('jsonwebtoken');

// 驗證 JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.sendError('缺少授權 token', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.sendError('無效的 token', 401);
  }
};

// 生成 JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = {
  verifyToken,
  generateToken
};
