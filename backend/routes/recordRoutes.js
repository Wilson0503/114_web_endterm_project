const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { verifyToken } = require('../utils/auth');

// 所有記錄路由都需要驗證
router.use(verifyToken);

// CRUD 操作
router.post('/', recordController.createRecord);
router.get('/', recordController.getUserRecords);
router.get('/stats/day', recordController.getDayStats);
router.get('/:id', recordController.getRecordById);
router.put('/:id', recordController.updateRecord);
router.delete('/:id', recordController.deleteRecord);

module.exports = router;
