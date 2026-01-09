const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../utils/auth');

// 公開路由
router.post('/register', userController.register);
router.post('/login', userController.login);

// 受保護的路由
router.get('/me', verifyToken, userController.getCurrentUser);
router.put('/me', verifyToken, userController.updateUser);
router.get('/stats', verifyToken, userController.getUserStats);

module.exports = router;
