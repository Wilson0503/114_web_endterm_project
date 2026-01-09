const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const { verifyToken } = require('../utils/auth');

// 公開路由
router.get('/', foodController.getAllFoods);
router.get('/search/name', foodController.searchByName);
router.get('/search/barcode/:barcode', foodController.searchByBarcode);
router.get('/:id', foodController.getFoodById);

// 受保護的路由
router.post('/', verifyToken, foodController.createFood);
router.put('/:id', verifyToken, foodController.updateFood);
router.delete('/:id', verifyToken, foodController.deleteFood);

module.exports = router;
