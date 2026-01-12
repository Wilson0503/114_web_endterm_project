const Food = require('../models/Food');
const { searchOpenFoodFactsByBarcode, searchTFDAFood } = require('../utils/externalApis');

// 建立新食物（Create）
const createFood = async (req, res) => {
  try {
    // 取得請求資料
    let { name, brand, servingSize, servingUnit, calories, protein, fat, carbohydrates } = req.body;

    // [新增] 自動計算卡路里邏輯
    // 如果沒有提供卡路里，或卡路里為 0，則自動計算
    if (!calories && calories !== 0) {
      // 確保數值為數字，若無則預設為 0
      const p = Number(protein) || 0;
      const c = Number(carbohydrates) || 0;
      const f = Number(fat) || 0;
      
      // 公式：蛋白質*4 + 碳水*4 + 脂肪*9
      calories = Math.round((p * 4) + (c * 4) + (f * 9));
    }

    // 建立新食物物件 (保持原有的建立邏輯，但使用處理過的 calories)
    const newFood = new Food({
      name,
      brand,
      servingSize,
      servingUnit,
      calories, // 這裡會是使用者輸入的或是自動計算的
      protein,
      fat,
      carbohydrates,
      isCustom: true,
      createdBy: req.user._id
    });

    await newFood.save();
    res.sendSuccess(newFood, '食物已建立', 201);
  } catch (error) {
    res.sendError('建立食物失敗', 500, error);
  }
};

// 獲取所有食物（Read All）
const getAllFoods = async (req, res) => {
  try {
    const { search, source } = req.query;
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (source) {
      filter.source = source;
    }

    const foods = await Food.find(filter)
      .limit(100)
      .sort({ createdAt: -1 });

    res.sendSuccess(foods, '獲取食物清單成功');
  } catch (error) {
    res.sendError('獲取食物清單失敗', 500, error);
  }
};

// 獲取特定食物（Read Single）
const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food) {
      return res.sendError('食物不存在', 404);
    }

    res.sendSuccess(food, '獲取食物資訊成功');
  } catch (error) {
    res.sendError('獲取食物資訊失敗', 500, error);
  }
};

// 更新食物（Update）
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, calories, protein, carbs, fat, servingSize } = req.body;

    const food = await Food.findById(id);
    if (!food) {
      return res.sendError('食物不存在', 404);
    }

    if (name !== undefined) food.name = name;
    if (calories !== undefined) food.calories = calories;
    if (protein !== undefined) food.protein = protein;
    if (carbs !== undefined) food.carbs = carbs;
    if (fat !== undefined) food.fat = fat;
    if (servingSize !== undefined) food.servingSize = servingSize;
    
    food.updatedAt = Date.now();
    await food.save();

    res.sendSuccess(food, '食物已更新');
  } catch (error) {
    res.sendError('更新食物失敗', 500, error);
  }
};

// 刪除食物（Delete）
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findByIdAndDelete(id);

    if (!food) {
      return res.sendError('食物不存在', 404);
    }

    res.sendSuccess(food, '食物已刪除');
  } catch (error) {
    res.sendError('刪除食物失敗', 500, error);
  }
};

// 從條碼搜尋食物（Open Food Facts）
const searchByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    if (!barcode) {
      return res.sendError('缺少條碼', 400);
    }

    const foodData = await searchOpenFoodFactsByBarcode(barcode);
    
    if (!foodData) {
      return res.sendError('未找到該條碼的食物資料', 404);
    }

    // 檢查是否已存在於資料庫
    let food = await Food.findOne({ sourceId: barcode });
    
    if (!food) {
      food = new Food(foodData);
      await food.save();
    }

    res.sendSuccess(food, '找到食物資料');
  } catch (error) {
    res.sendError('搜尋食物失敗', 500, error);
  }
};

// 搜尋食物名稱（先從本地，再從外部 API）
const searchByName = async (req, res) => {
  try {
    const { name, source } = req.query;

    if (!name) {
      return res.sendError('缺少食物名稱', 400);
    }

    let results = [];

    // 優先從本地資料庫搜尋
    const localFoods = await Food.find({
      name: { $regex: name, $options: 'i' }
    }).limit(10);
    results = [...localFoods];

    // 如果指定搜尋 TFDA 或沒有本地結果
    if (source === 'tfda' || (source !== 'local' && results.length === 0)) {
      try {
        const tfdaFoods = await searchTFDAFood(name);
        if (tfdaFoods && Array.isArray(tfdaFoods)) {
          results = [...results, ...tfdaFoods.slice(0, 5)];
        }
      } catch (tfdaError) {
        console.warn('TFDA API 搜尋失敗:', tfdaError.message);
        // 繼續執行，不中斷
      }
    }

    res.sendSuccess(
      results.slice(0, 15), 
      `找到 ${results.length} 個食物結果`
    );
  } catch (error) {
    res.sendError('搜尋失敗', 500, error);
  }
};

module.exports = {
  createFood,
  getAllFoods,
  getFoodById,
  updateFood,
  deleteFood,
  searchByBarcode,
  searchByName
};
