# 飲食記錄系統 - 系統架構文件

## 1. 專案概述

### 目標
建立一個完整的飲食記錄系統，使用戶能夠：
- 記錄每日飲食並追蹤卡路里攝入量
- 管理自訂食物資料
- 從外部 API（Open Food Facts、TFDA）查詢食物資訊
- 查看飲食統計和分析

### 技術棧

**後端**:
- Node.js + Express.js
- MongoDB (資料庫)
- JWT (身份驗證)
- Axios (API 調用)

**前端**:
- React 18
- React Router DOM
- Axios
- CSS3

---

## 2. 系統架構圖

```
┌─────────────────────────────────────────────────────────┐
│                    使用者瀏覽器                            │
│                    (React Application)                    │
└──────────────────────────┬──────────────────────────────┘
                          │
                    HTTP/CORS
                          │
┌──────────────────────────▼──────────────────────────────┐
│                     API Server                          │
│                 (Express.js + Node.js)                  │
│                                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Routes & Controllers                  │ │
│  │  ├─ User Routes (register, login, profile)        │ │
│  │  ├─ Food Routes (CRUD operations)                 │ │
│  │  └─ Record Routes (飲食記錄 CRUD)                  │ │
│  └────────────────────────────────────────────────────┘ │
│                          │                              │
│  ┌────────────┬─────────┴──────────┬──────────────────┐ │
│  │            │                    │                  │  │
│  ▼            ▼                    ▼                  ▼  │
│ User      Food            Record          External API  │
│ Model    Model            Model            Integration  │
│                                                         │
└──────────────────────────┬──────────────────────────────┘
                          │
                    Mongoose ODM
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
    ┌────────┐        ┌────────┐      ┌──────────────┐
    │MongoDB │        │ TFDA   │      │ Open Food    │
    │Database│        │ API    │      │ Facts API    │
    └────────┘        └────────┘      └──────────────┘
```

---

## 3. 資料庫設計

### MongoDB 集合結構

#### Users 集合
```javascript
{
  _id: ObjectId,
  username: String (unique, min: 3),
  email: String (unique, match: email format),
  password: String (hashed, min: 6),
  createdAt: Date
}
```

#### Foods 集合
```javascript
{
  _id: ObjectId,
  name: String (required),
  calories: Number (required, min: 0),
  protein: Number (default: 0),
  carbs: Number (default: 0),
  fat: Number (default: 0),
  servingSize: String (default: "100克"),
  source: String (enum: ['user', 'tfda', 'open_food_facts']),
  sourceId: String (external API food ID),
  createdBy: ObjectId (reference to User),
  isPublic: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

#### Records 集合
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User, required),
  foodId: ObjectId (reference to Food, required),
  quantity: Number (required, min: 0.1),
  mealType: String (enum: ['breakfast', 'lunch', 'dinner', 'snack']),
  totalCalories: Number (calculated: food.calories * quantity),
  notes: String (optional),
  recordedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 4. 外部 API 整合

### Open Food Facts API

用於按條碼查詢食物營養資訊：

**端點**: `https://world.openfoodfacts.org/api/v0/product/{barcode}.json`

**功能**:
- 按條碼查詢食物
- 獲取營養成分資訊
- 支援全球商品資料庫

**實現位置**: `backend/utils/externalApis.js` - `searchOpenFoodFactsByBarcode()`

### TFDA (台灣食品藥物管理署) API

用於查詢台灣食品營養資訊（原形食物和包裝食品）：

**端點**: 基於 `https://open.lis.ntu.edu.tw/api`

**功能**:
- 查詢台灣官方食品資料庫
- 獲取營養標示資訊
- 授權: Open Government Data License 1.0

**實現位置**: `backend/utils/externalApis.js` - `searchTFDAFood()`

---

## 5. 認證流程

```
用戶輸入憑證
      │
      ▼
   登入/註冊 API
      │
      ├─ 驗證郵箱/密碼
      │
      ▼
生成 JWT Token
      │
      ├─ Token 包含: userId, 有效期 30 天
      │
      ▼
返回 Token 給前端
      │
      ├─ 前端儲存在 localStorage
      │
      ▼
後續 API 請求附加 Token
      │
      ├─ Header: Authorization: Bearer {token}
      │
      ▼
伺服器驗證 Token
      │
      └─ 有效 → 處理請求
        無效 → 401 Unauthorized
```

---

## 6. CRUD 操作流程

### 飲食記錄 CRUD 流程圖

```
┌──────────────────────────────────────────────────────────────┐
│                    使用者界面 (React)                         │
│  ┌────────────┬─────────────┬─────────────┬──────────────┐  │
│  │ RecordForm │ RecordList  │FoodManager  │ Dashboard    │  │
│  └────────────┴─────────────┴─────────────┴──────────────┘  │
└──────────────┬───────────────────────────────────────────────┘
               │
        API 調用 (axios)
               │
┌──────────────▼───────────────────────────────────────────────┐
│                  後端 Express 路由層                          │
│  ┌──────────────┬──────────────┬──────────────────────────┐  │
│  │ POST /api/   │ GET /api/    │ PUT /api/records/:id    │  │
│  │ records      │ records      │ DELETE /api/records/:id │  │
│  └──────────────┴──────────────┴──────────────────────────┘  │
└──────────────┬───────────────────────────────────────────────┘
               │
      控制器層 (Controllers)
               │
┌──────────────▼───────────────────────────────────────────────┐
│          記錄控制器 (recordController.js)                     │
│  ├─ createRecord()      [CREATE]                             │
│  ├─ getUserRecords()    [READ ALL]                           │
│  ├─ getRecordById()     [READ SINGLE]                        │
│  ├─ updateRecord()      [UPDATE]                             │
│  ├─ deleteRecord()      [DELETE]                             │
│  └─ getDayStats()       [STATISTICS]                         │
└──────────────┬───────────────────────────────────────────────┘
               │
       Mongoose ODM
               │
┌──────────────▼───────────────────────────────────────────────┐
│              MongoDB 資料庫操作                               │
│    ├─ db.records.insertOne()      [CREATE]                   │
│    ├─ db.records.find()           [READ]                     │
│    ├─ db.records.findByIdAndUpdate() [UPDATE]                │
│    ├─ db.records.findByIdAndDelete() [DELETE]                │
│    └─ db.records.aggregate()      [STATISTICS]               │
└───────────────────────────────────────────────────────────────┘

