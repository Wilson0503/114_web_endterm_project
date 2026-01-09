const Record = require('../models/Record');
const Food = require('../models/Food');

// 建立新記錄（Create）
const createRecord = async (req, res) => {
  try {
    const { foodId, quantity, mealType, recordedAt, notes } = req.body;

    if (!foodId || !quantity || !mealType) {
      return res.sendError('缺少必要欄位', 400);
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.sendError('食物不存在', 404);
    }

    const totalCalories = Math.round(food.calories * quantity);

    const newRecord = new Record({
      userId: req.userId,
      foodId,
      quantity,
      mealType,
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      totalCalories,
      notes: notes || ''
    });

    await newRecord.save();
    await newRecord.populate('foodId');

    res.sendSuccess(newRecord, '飲食記錄已建立', 201);
  } catch (error) {
    res.sendError('建立記錄失敗', 500, error);
  }
};

// 獲取用戶的所有記錄（Read All）
const getUserRecords = async (req, res) => {
  try {
    const { startDate, endDate, mealType } = req.query;
    let filter = { userId: req.userId };

    if (startDate || endDate) {
      filter.recordedAt = {};
      if (startDate) filter.recordedAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.recordedAt.$lte = end;
      }
    }

    if (mealType) {
      filter.mealType = mealType;
    }

    const records = await Record.find(filter)
      .populate('foodId')
      .sort({ recordedAt: -1 });

    res.sendSuccess(records, '獲取記錄清單成功');
  } catch (error) {
    res.sendError('獲取記錄清單失敗', 500, error);
  }
};

// 獲取特定記錄（Read Single）
const getRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Record.findById(id).populate('foodId');

    if (!record) {
      return res.sendError('記錄不存在', 404);
    }

    if (record.userId.toString() !== req.userId.toString()) {
      return res.sendError('無權限訪問此記錄', 403);
    }

    res.sendSuccess(record, '獲取記錄成功');
  } catch (error) {
    res.sendError('獲取記錄失敗', 500, error);
  }
};

// 更新記錄（Update）
const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { foodId, quantity, mealType, recordedAt, notes } = req.body;

    const record = await Record.findById(id);
    if (!record) {
      return res.sendError('記錄不存在', 404);
    }

    if (record.userId.toString() !== req.userId.toString()) {
      return res.sendError('無權限修改此記錄', 403);
    }

    if (foodId !== undefined) {
      const food = await Food.findById(foodId);
      if (!food) {
        return res.sendError('食物不存在', 404);
      }
      record.foodId = foodId;
    }

    if (quantity !== undefined) record.quantity = quantity;
    if (mealType !== undefined) record.mealType = mealType;
    if (recordedAt !== undefined) record.recordedAt = new Date(recordedAt);
    if (notes !== undefined) record.notes = notes;

    // 重新計算總卡路里
    const food = await Food.findById(record.foodId);
    record.totalCalories = Math.round(food.calories * record.quantity);

    record.updatedAt = Date.now();
    await record.save();
    await record.populate('foodId');

    res.sendSuccess(record, '記錄已更新');
  } catch (error) {
    res.sendError('更新記錄失敗', 500, error);
  }
};

// 刪除記錄（Delete）
const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Record.findById(id);

    if (!record) {
      return res.sendError('記錄不存在', 404);
    }

    if (record.userId.toString() !== req.userId.toString()) {
      return res.sendError('無權限刪除此記錄', 403);
    }

    await Record.findByIdAndDelete(id);
    res.sendSuccess(record, '記錄已刪除');
  } catch (error) {
    res.sendError('刪除記錄失敗', 500, error);
  }
};

// 獲取日期的統計
const getDayStats = async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const records = await Record.find({
      userId: req.userId,
      recordedAt: { $gte: startDate, $lte: endDate }
    }).populate('foodId');

    const stats = {
      date,
      totalCalories: 0,
      mealBreakdown: {
        breakfast: { count: 0, calories: 0 },
        lunch: { count: 0, calories: 0 },
        dinner: { count: 0, calories: 0 },
        snack: { count: 0, calories: 0 }
      },
      records
    };

    records.forEach(record => {
      stats.totalCalories += record.totalCalories;
      stats.mealBreakdown[record.mealType].count += 1;
      stats.mealBreakdown[record.mealType].calories += record.totalCalories;
    });

    res.sendSuccess(stats, '獲取日期統計成功');
  } catch (error) {
    res.sendError('獲取日期統計失敗', 500, error);
  }
};

module.exports = {
  createRecord,
  getUserRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  getDayStats
};
