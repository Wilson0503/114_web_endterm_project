const axios = require('axios');
const tfdaFoods = require('../data/tfdaFoods');

// 從 Open Food Facts 查詢食物資料
const searchOpenFoodFactsByBarcode = async (barcode) => {
  try {
    const response = await axios.get(
      `${process.env.OPEN_FOOD_FACTS_API}/product/${barcode}.json`
    );
    
    if (response.data.status === 1) {
      const product = response.data.product;
      return {
        name: product.product_name || product.generic_name || '未知商品',
        calories: product.nutriments?.['energy-kcal'] || product.nutriments?.['energy_kcal'] || 0,
        protein: product.nutriments?.proteins || 0,
        carbs: product.nutriments?.carbohydrates || 0,
        fat: product.nutriments?.fat || 0,
        servingSize: '100克',
        source: 'open_food_facts',
        sourceId: barcode
      };
    }
    return null;
  } catch (error) {
    console.error('Open Food Facts API 錯誤:', error);
    return null;
  }
};

// 從本地 TFDA 資料庫查詢食物資料
const searchTFDAFood = async (foodName) => {
  try {
    // 使用本地 TFDA 食品資料庫
    const results = tfdaFoods
      .filter(food => 
        food.name.toLowerCase().includes(foodName.toLowerCase())
      )
      .map(food => ({
        ...food,
        source: 'tfda',
        sourceId: food.name
      }))
      .slice(0, 10); // 限制返回 10 個結果
    
    return results;
  } catch (error) {
    console.error('TFDA 本地搜尋錯誤:', error.message);
    return [];
  }
};

module.exports = {
  searchOpenFoodFactsByBarcode,
  searchTFDAFood
};
