# 飲食記錄系統 (Nutrition Tracker)

一個完整的全棧網頁應用，幫助使用者追蹤每日飲食和卡路里攝入量。整合了台灣食品資料庫 (TFDA) 和國際食品資料庫 (Open Food Facts) 的 API，讓使用者可以方便地查詢和記錄食物資訊。

##  功能特色

- **用戶認證系統**: 註冊、登入、會話管理
- **飲食記錄功能**: 新增、編輯、刪除、查詢飲食記錄
- **食物管理**: 自訂食物資料或使用公共食物庫
- **外部 API 整合**:
  - Open Food Facts: 按條碼查詢國際商品
  - TFDA: 查詢台灣食品官方資料
- **統計分析**: 每日卡路里統計、餐型分佈
- **美觀界面**: 響應式設計，支援行動設備
- **完整的 CRUD 操作**: Create, Read, Update, Delete

##  技術棧

### 前端
- **React 18** - UI 框架
## 功能特色
- **Axios** - HTTP 客戶端
- **Date-fns** - 日期處理
- **MongoDB** - NoSQL 資料庫
- **Mongoose** - ODM 層

注意：本專案包含 `backend/data/tfdaFoods.js` 作為本地 TFDA 範例資料，預設會從本地快取查詢台灣食品。如需使用線上 TFDA API，請設定 `TFDA_API_BASE` 並在 `backend/utils/externalApis.js` 啟用線上呼叫。

##  專案結構

```
nutrition-tracker/
│
├── frontend/                    # React 應用
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # React 元件
│   │   │   ├── Auth.js         # 登入/註冊
│   │   │   ├── FoodManager.js  # 食物管理
│   │   │   ├── RecordForm.js   # 記錄表單
│   │   │   └── RecordList.js   # 記錄列表
│   │   ├── context/            # 狀態管理
│   │   │   ├── AuthContext.js
│   │   │   └── FoodContext.js
│   │   ├── pages/              # 頁面元件
│   │   │   └── Dashboard.js
│   │   ├── services/           # API 服務
│   │   │   └── api.js
│   │   ├── styles/             # CSS 樣式
│   │   │   ├── global.css
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── RecordForm.css
│   │   │   ├── RecordList.css
│   │   │   └── FoodManager.css
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── .env                    # 環境變數
│   └── .gitignore
│
├── backend/                    # Express 應用
│   ├── controllers/            # 請求控制器
│   │   ├── userController.js
│   │   ├── foodController.js
│   │   └── recordController.js
│   ├── models/                 # 資料模型
│   │   ├── User.js
│   │   ├── Food.js
│   │   └── Record.js
│   ├── routes/                 # API 路由
│   │   ├── userRoutes.js
│   │   ├── foodRoutes.js
│   │   └── recordRoutes.js
│   ├── utils/                  # 工具函數
│   │   ├── auth.js            # 認證邏輯
│   │   └── externalApis.js    # 外部 API 調用
│   ├── server.js              # 應用入口
│   ├── package.json
│   ├── .env                   # 環境變數
│   └── .gitignore
│
├── docs/                      # 文件
│   ├── API-SPEC.md           # API 規格文件
│   ├── ARCHITECTURE.md        # 架構文件
│   └── DESIGN-PATTERNS.md    # 設計模式說明
│
├── README.md                 # 本檔案
└── .gitignore
```
- Node.js v16+ (建議 v18 LTS)
- npm 或 yarn
- MongoDB (本地或 MongoDB Atlas)

### 安裝步驟

#### 1. 克隆專案
```bash
git clone https://github.com/yourusername/nutrition-tracker.git
cd nutrition-tracker
```

#### 2. 安裝後端依賴
```bash
cd backend
npm install
```

#### 3. 配置後端環境變數
編輯 `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/nutrition-tracker
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
TFDA_API_BASE=https://open.lis.ntu.edu.tw/api
OPEN_FOOD_FACTS_API=https://world.openfoodfacts.org/api/v0
```

#### 4. 配置 MongoDB

**推薦：使用 MongoDB Atlas (免費雲端數據庫)**

詳見 [MONGODB_SETUP.md](MONGODB_SETUP.md) 快速設置指南 (3 分鐘完成)

**或本地安裝 MongoDB**:
```bash
# macOS (使用 Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
# 注意：在大多數 Linux 發行版，服務名稱為 mongod，使用以下指令啟動：
sudo systemctl start mongod

# 或使用 Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

#### 5. 啟動後端伺服器
```bash
npm start
# 或開發模式
npm run dev
```

後端將在 `http://localhost:5000` 運行

#### 6. 安裝前端依賴
```bash
cd ../frontend
npm install
```

#### 7. 配置前端環境變數
編輯 `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 8. 啟動前端應用
```bash
npm start
```

前端將在 `http://localhost:3000` 運行

## 📖 使用指南

### 首次使用

1. **註冊帳戶**
   - 點擊「立即註冊」
   - 輸入用戶名、郵箱、密碼
   - 完成註冊

2. **登入**
   - 輸入郵箱和密碼
   - 成功登入後進入儀表板

3. **記錄飲食**
   - 在「飲食記錄」頁面
   - 搜尋或選擇食物
   - 輸入份量和用餐時間
   - 點擊「記錄飲食」

4. **管理食物**
   - 在「食物管理」頁面
   - 新增自訂食物
   - 編輯或刪除食物

5. **查看統計**
   - 每日總卡路里統計
   - 按餐型分佈顯示

##  API 認證

所有受保護的端點都需要在 HTTP Header 中提供 JWT token：

```
Authorization: Bearer <your_jwt_token>
```

Token 可在登入或註冊後獲取，有效期為 30 天。

##  API 端點

### 用戶管理
```
POST   /api/users/register        # 註冊
POST   /api/users/login           # 登入
GET    /api/users/me              # 獲取當前用戶
PUT    /api/users/me              # 更新用戶資訊
GET    /api/users/stats           # 獲取統計資訊
```

### 食物管理
```
GET    /api/foods                 # 獲取所有食物
GET    /api/foods/:id             # 獲取特定食物
POST   /api/foods                 # 建立食物
PUT    /api/foods/:id             # 更新食物
DELETE /api/foods/:id             # 刪除食物
GET    /api/foods/search/name     # 按名稱搜尋
GET    /api/foods/search/barcode/:barcode  # 按條碼搜尋
```

### 飲食記錄
```
GET    /api/records               # 獲取用戶記錄
GET    /api/records/:id           # 獲取特定記錄
POST   /api/records               # 建立記錄
PUT    /api/records/:id           # 更新記錄
DELETE /api/records/:id           # 刪除記錄
GET    /api/records/stats/day     # 獲取日期統計
```

詳細 API 文件見: [API-SPEC.md](docs/API-SPEC.md)

- 使用者友善的登入/註冊界面
- 漸層背景設計
- 側邊欄導航
- 響應式佈局
- 日期選擇器
- 餐型分類顯示
- 新增自訂食物表單
- 食物列表展示
- 編輯/刪除操作

- **用途**: 按條碼查詢國際商品資訊
- **端點**: `GET /foods/search/barcode/:barcode`
- **用途**: 查詢台灣食品營養資訊
- **授權**: Open Government Data License 1.0
- **資料來源**: data.gov.tw 食品營養成分資料集

##  測試帳戶

```
郵箱: test@example.com
密碼: password123
```

- **Repository Pattern**: 資料庫操作層封裝
- **Middleware Pattern**: 統一請求處理
- **Context API Pattern**: 狀態管理
- **Component Composition**: 可重用元件
- **Custom Hooks**: 邏輯復用

詳見: [ARCHITECTURE.md](docs/ARCHITECTURE.md)

##  常見問題

### Q: MongoDB 連線失敗
A: 確保 MongoDB 已安裝並運行。執行 `mongod` 命令啟動伺服器。

### Q: 前端無法連接後端
A: 檢查 `.env` 中的 `REACT_APP_API_URL` 是否正確配置。

### Q: Token 過期
A: Token 有效期為 30 天，過期後重新登入即可。

### Q: 外部 API 查詢失敗
A: 檢查網路連線和 API 端點可用性。
- [ ] 端對端測試
- [ ] 性能優化
- [ ] 部署配置

##  部署指南

### 本機運行

**啟動後端**:
```bash
cd backend
npm start
```

**啟動前端**:
```bash
cd frontend
npm start
```

### 生產部署
- **前端**: Vercel, Netlify 等靜態主機
- **後端**: Heroku, Railway, AWS 等應用伺服器
- **資料庫**: MongoDB Atlas (雲端) 或自行維護

##  許可證

MIT License

##  作者

學生姓名: Wilson Chen

- 郵箱: your.email@example.com
- GitHub: https://github.com/yourusername

- [台灣食品藥物管理署](https://www.fda.gov.tw/) - 台灣食品資料
- React, Express, MongoDB 等開源社群

---

**最後更新**: 2025 年 1 月 9 日
