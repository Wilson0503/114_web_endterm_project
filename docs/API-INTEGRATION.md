# API 集成指南

## 概述

本系統整合了多個外部 API 來提供豐富的食物資料。本文件說明如何使用和自訂這些集成。

---

## 1. Open Food Facts API 集成

### 概述

Open Food Facts 提供全球商品條碼資料庫，包含營養信息。

**官方網站**: https://world.openfoodfacts.org/
**API 文件**: https://wiki.openfoodfacts.org/API

### 功能

按條碼查詢食物資訊，獲取營養成分數據。

### 實現位置

`backend/utils/externalApis.js` - `searchOpenFoodFactsByBarcode()`

### 使用示例

**API 端點**:
```
GET https://world.openfoodfacts.org/api/v0/product/{barcode}.json
```

**後端實現**:
```javascript
const searchOpenFoodFactsByBarcode = async (barcode) => {
  try {
    const response = await axios.get(
      `${process.env.OPEN_FOOD_FACTS_API}/product/${barcode}.json`
    );
    
    if (response.data.status === 1) {
      const product = response.data.product;
      return {
        name: product.product_name || product.generic_name,
        calories: product.nutriments?.['energy-kcal'] || 0,
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
```

**前端調用**:
```javascript
// 在 RecordForm 中
const handleSearchByBarcode = async (barcode) => {
  try {
    const res = await foodApi.searchByBarcode(barcode);
    // 使用返回的食物資料
  } catch (error) {
    console.error('搜尋失敗', error);
  }
};
```

### 條碼格式

支援以下條碼格式：
- EAN-13 (最常見)
- EAN-8
- UPC (美國)

### 範例條碼

```javascript
// 常見台灣商品條碼
const testBarcodes = [
  '4710180700627', // 統一麥香紅茶
  '4904901085632', // 7-11 便當
  '8809093081000'  // 外帶咖啡
];
```

### 限制事項

- 無速率限制
- 部分商品資訊不完整
- 營養信息可能不準確
- 需要網路連接

### 故障處理

```javascript
if (!foodData) {
  console.log('未找到條碼對應的商品');
  // 提示用戶手動輸入
}
```

---

## 2. TFDA (台灣食品藥物管理署) API 集成

### 概述

TFDA 提供台灣食品營養資訊的官方資料庫。

**官方網站**: https://www.fda.gov.tw/
**開放資料**: https://data.gov.tw/dataset/8032
**OAS 文件**: 根據 data.gov.tw 提供

### 資料來源

#### 方式 1: 直接 API 查詢

**基礎 URL**: `https://open.lis.ntu.edu.tw/api`

```javascript
const searchTFDAFood = async (foodName) => {
  try {
    const response = await axios.get(
      `${process.env.TFDA_API_BASE}/Food`,
      {
        params: { name: foodName }
      }
    );
    
    if (response.data && response.data.length > 0) {
      const food = response.data[0];
      return {
        name: food.name || foodName,
        calories: food.calories || 0,
        protein: food.protein || 0,
        carbs: food.carbohydrates || 0,
        fat: food.fat || 0,
        servingSize: '100克',
        source: 'tfda',
        sourceId: food.id
      };
    }
    return null;
  } catch (error) {
    console.error('TFDA API 錯誤:', error);
    return null;
  }
};
```

#### 方式 2: CSV 資料匯入

從 data.gov.tw 下載食品營養成分 CSV 文件，進行批量匯入：

```javascript
// CSV 導入腳本
const csv = require('csv-parser');
const fs = require('fs');
const Food = require('../models/Food');

const importFoodsFromCSV = async (filePath) => {
  const foods = [];
  
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      foods.push({
        name: row.食品名稱,
        calories: parseFloat(row.熱量),
        protein: parseFloat(row.蛋白質),
        carbs: parseFloat(row.碳水化合物),
        fat: parseFloat(row.脂肪),
        source: 'tfda',
        sourceId: row.食品代碼,
        isPublic: true
      });
    })
    .on('end', async () => {
      await Food.insertMany(foods);
      console.log(`已匯入 ${foods.length} 項食品`);
    });
};
```

### 支援的營養成分

- 熱量 (kcal)
- 蛋白質 (g)
- 脂肪 (g)
- 飽和脂肪 (g)
- 反式脂肪 (g)
- 碳水化合物 (g)
- 膳食纖維 (g)
- 糖 (g)
- 鈉 (mg)
- 膽固醇 (mg)
- 鈣、鐵、磷等礦物質

### 授權

**Open Government Data License 1.0**
- 可自由使用、修改和再發佈
- 需標註原始資料來源
- 不得用於商業目的（除非有另外授權）

### 實現位置

`backend/utils/externalApis.js` - `searchTFDAFood()`

---

## 3. 本地資料庫集成

### 自訂食物資料

用戶可以自訂添加食物資料，不依賴外部 API：

```javascript
const createFood = async (req, res) => {
  const { name, calories, protein, carbs, fat, servingSize } = req.body;
  
  const newFood = new Food({
    name,
    calories,
    protein: protein || 0,
    carbs: carbs || 0,
    fat: fat || 0,
    servingSize: servingSize || '100克',
    source: 'user',
    createdBy: req.userId
  });
  
  await newFood.save();
};
```

### 食物共享機制

```javascript
// 將用戶食物設為公開
const food = await Food.findByIdAndUpdate(
  foodId,
  { isPublic: true },
  { new: true }
);

// 查詢公開食物
const publicFoods = await Food.find({ isPublic: true });
```

---

## 4. 資料優先級

系統按以下優先級使用食物資料：

1. **用戶輸入的自訂食物** (最高優先級)
2. **本地資料庫中的食物**
3. **Open Food Facts 資料**
4. **TFDA 官方資料**
5. **新 API 資料** (最低優先級)

```javascript
const searchFood = async (query) => {
  // 1. 先從本地查詢用戶食物
  let food = await Food.findOne({
    name: { $regex: query, $options: 'i' },
    createdBy: userId
  });
  
  if (food) return food;
  
  // 2. 查詢公開食物
  food = await Food.findOne({
    name: { $regex: query, $options: 'i' },
    isPublic: true
  });
  
  if (food) return food;
  
  // 3. 嘗試從外部 API 查詢
  const tfda = await searchTFDAFood(query);
  if (tfda) return tfda;
  
  return null;
};
```

---

## 5. 錯誤處理

### 網路錯誤

```javascript
try {
  const data = await searchOpenFoodFactsByBarcode(barcode);
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    console.log('無法連接外部 API');
  } else if (error.response?.status === 404) {
    console.log('資源不存在');
  } else {
    console.log('未知錯誤');
  }
}
```

### 資料驗證

```javascript
const validateFoodData = (food) => {
  const errors = [];
  
  if (!food.name || food.name.trim() === '') {
    errors.push('食物名稱不能為空');
  }
  
  if (typeof food.calories !== 'number' || food.calories < 0) {
    errors.push('卡路里必須是非負數');
  }
  
  return { valid: errors.length === 0, errors };
};
```

---

## 6. 性能優化

### 緩存策略

```javascript
// 緩存外部 API 結果
const cache = new Map();

const getCachedFood = async (barcode) => {
  if (cache.has(barcode)) {
    return cache.get(barcode);
  }
  
  const food = await searchOpenFoodFactsByBarcode(barcode);
  if (food) {
    cache.set(barcode, food);
    // 1 小時後過期
    setTimeout(() => cache.delete(barcode), 3600000);
  }
  
  return food;
};
```

### 批量查詢

```javascript
const searchMultipleFoods = async (barcodes) => {
  const promises = barcodes.map(barcode =>
    searchOpenFoodFactsByBarcode(barcode)
  );
  
  return Promise.allSettled(promises);
};
```

---


## 參考資源

- [Open Food Facts API 文件](https://wiki.openfoodfacts.org/API)
- [TFDA 官方網站](https://www.fda.gov.tw/)

