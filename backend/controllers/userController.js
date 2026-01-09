const User = require('../models/User');
const Record = require('../models/Record');
const Food = require('../models/Food');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/auth');

// 用戶註冊
const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password) {
      return res.sendError('缺少必要的欄位', 400);
    }

    if (password !== confirmPassword) {
      return res.sendError('密碼不一致', 400);
    }

    // 郵箱轉為小寫
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ $or: [{ username }, { email: normalizedEmail }] });
    if (existingUser) {
      return res.sendError('用戶名或郵箱已存在', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email: normalizedEmail, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser._id);
    res.sendSuccess({ 
      userId: newUser._id, 
      username: newUser.username,
      email: newUser.email,
      token 
    }, '註冊成功', 201);
  } catch (error) {
    res.sendError('註冊失敗', 500, error);
  }
};

// 用戶登入
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendError('缺少郵箱或密碼', 400);
    }

    // 郵箱轉為小寫
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.sendError('用戶不存在', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.sendError('密碼錯誤', 401);
    }

    const token = generateToken(user._id);
    res.sendSuccess({ 
      userId: user._id, 
      username: user.username,
      email: user.email,
      token 
    }, '登入成功');
  } catch (error) {
    res.sendError('登入失敗', 500, error);
  }
};

// 獲取當前用戶資訊
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.sendError('用戶不存在', 404);
    }
    res.sendSuccess(user, '獲取用戶資訊成功');
  } catch (error) {
    res.sendError('獲取用戶資訊失敗', 500, error);
  }
};

// 更新用戶資訊
const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const update = {};

    if (username) update.username = username;
    if (email) update.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      update,
      { new: true }
    ).select('-password');

    res.sendSuccess(updatedUser, '用戶資訊已更新');
  } catch (error) {
    res.sendError('更新用戶資訊失敗', 500, error);
  }
};

// 獲取用戶統計資訊
const getUserStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filter = { userId: req.userId };
    
    if (startDate || endDate) {
      filter.recordedAt = {};
      if (startDate) filter.recordedAt.$gte = new Date(startDate);
      if (endDate) filter.recordedAt.$lte = new Date(endDate);
    }

    const records = await Record.find(filter);
    
    const stats = {
      totalRecords: records.length,
      totalCalories: records.reduce((sum, r) => sum + r.totalCalories, 0),
      avgCaloriesPerDay: 0,
      recordsByMealType: {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snack: 0
      }
    };

    records.forEach(record => {
      stats.recordsByMealType[record.mealType] = 
        (stats.recordsByMealType[record.mealType] || 0) + 1;
    });

    if (records.length > 0) {
      const uniqueDays = new Set(
        records.map(r => r.recordedAt.toDateString())
      ).size;
      stats.avgCaloriesPerDay = Math.round(stats.totalCalories / uniqueDays);
    }

    res.sendSuccess(stats, '獲取統計資訊成功');
  } catch (error) {
    res.sendError('獲取統計資訊失敗', 500, error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateUser,
  getUserStats
};
