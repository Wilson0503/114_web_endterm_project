require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const foodRoutes = require('./routes/foodRoutes');
const recordRoutes = require('./routes/recordRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// 中間件
app.use(cors());
app.use(express.json());

// 資料庫連線
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB 已連接'))
.catch(err => console.log('MongoDB 連線錯誤:', err));

// 統一回應格式的中間件
app.use((req, res, next) => {
  res.sendSuccess = (data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  };

  res.sendError = (message = 'Error', statusCode = 500, error = null) => {
    res.status(statusCode).json({
      success: false,
      message,
      error: error ? error.message : null,
      timestamp: new Date().toISOString()
    });
  };

  next();
});

// 路由
app.use('/api/foods', foodRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/users', userRoutes);

// 健康檢查端點
app.get('/api/health', (req, res) => {
  res.sendSuccess({ status: 'healthy' }, 'Health check passed');
});

// 404 處理
app.use((req, res) => {
  res.sendError('路由不存在', 404);
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err);
  res.sendError('伺服器內部錯誤', 500, err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`伺服器執行在 http://localhost:${PORT}`);
});
