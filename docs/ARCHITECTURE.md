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
```

---

## 7. 設計模式應用

### 後端設計模式

#### 1. Repository Pattern
**位置**: `controllers/` 目錄

**說明**: 透過 controller 層封裝資料庫操作邏輯

**優點**:
- 分離業務邏輯與資料存取
- 便於測試
- 提高程式碼可維護性

#### 2. Middleware Pattern
**位置**: `server.js`

**說明**: 統一回應格式、錯誤處理、身份驗證

**優點**:
- 集中式請求處理
- 統一的錯誤管理
- 便於添加日誌和監控

#### 3. Service Pattern (部分實現)
**位置**: `utils/externalApis.js`

**說明**: 外部 API 調用邏輯封裝為獨立服務

### 前端設計模式

#### 1. Context API Pattern
**位置**: `context/AuthContext.js`, `context/FoodContext.js`

**說明**: 狀態管理，避免 Prop Drilling

**優點**:
- 集中管理應用狀態
- 跨元件共享狀態
- 簡化狀態傳遞

#### 2. Component Composition Pattern
**位置**: `components/` 目錄

**說明**: 將 UI 分解為可重用元件

**優點**:
- 提高程式碼可重用性
- 便於維護和測試
- 清晰的職責分離

#### 3. Custom Hooks Pattern
**位置**: `context/` 中的 `useAuth`, `useFood` hooks

**說明**: 提取複雜的狀態邏輯為可重用 hooks

---

## 8. 安全考慮

### 身份驗證與授權
- 使用 JWT 進行無狀態身份驗證
- Token 有效期為 30 天
- 密碼使用 bcryptjs 進行雜湊

### 資料驗證
- 所有輸入資料進行型別檢查
- 郵箱格式驗證
- 數值範圍驗證

### CORS 設定
- 允許跨域請求
- 前端和後端分離部署

---

## 9. 效能考慮

### 資料庫查詢優化
- 使用索引加速查詢
- 使用 populate 進行關聯查詢
- 限制返回結果數量

### 前端優化
- 使用 React Context 避免不必要的重新渲染
- 實現搜尋結果緩存
- 按需加載功能

---

## 10. 擴展方案

### 未來功能
1. **目標設定**: 用戶可設定每日卡路里目標
2. **圖表分析**: 每月/每週飲食統計圖表
3. **推薦系統**: 基於用戶偏好的食物推薦
4. **匯出功能**: 導出飲食記錄為 PDF/CSV
5. **社交功能**: 分享飲食計畫和成就
6. **條碼掃描**: 使用相機掃描商品條碼
7. **多語言支援**: 支援英文、簡體中文等

---

## 11. 部署架構

```
前端 (React App)
  ├─ Static files (HTML, CSS, JS)
  └─ 部署到: Vercel / Netlify

後端 (Express Server)
  ├─ API Server
  ├─ 環境變數配置
  └─ 部署到: Heroku / Railway

資料庫 (MongoDB)
  ├─ MongoDB Atlas (雲端)
  └─ 或本地 MongoDB
```

---

## 12. 技術決策原因

| 技術選擇 | 原因 |
|--------|------|
| Node.js | 高效能、非阻塞 I/O、JavaScript 全棧開發 |
| Express | 輕量級、靈活、龐大的社群生態 |
| MongoDB | 靈活的 schema、易於擴展、適合快速開發 |
| React | 元件化開發、虛擬 DOM、豐富的生態系統 |
| JWT | 無狀態、適合分散式系統、易於實現 |
| Axios | 簡潔的 API、良好的錯誤處理、攔截器支援 |

