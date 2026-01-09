# 飲食記錄系統 - 快速開始指南

## 環境準備

### 系統需求
- Node.js v14+ (建議 v16 或更高)
- npm v6+ 或 yarn
- MongoDB v4.4+ (本機或雲端)
- Git

### 檢查環境

```bash
# 檢查 Node.js 版本
node --version

# 檢查 npm 版本
npm --version

# 檢查 Git 版本
git --version
```

---

## 一步步安裝指南

### 步驟 1: 克隆專案

```bash
# 方式一：使用 HTTPS
git clone https://github.com/yourusername/nutrition-tracker.git
cd nutrition-tracker

# 方式二：使用 SSH
git clone git@github.com:yourusername/nutrition-tracker.git
cd nutrition-tracker
```

### 步驟 2: 後端設置

#### 2.1 安裝依賴
```bash
cd backend
npm install
```

#### 2.2 配置環境變數

複製範本文件：
```bash
cp .env.example .env
```

編輯 `.env` 文件，設定你的配置：

```env
# 資料庫
MONGODB_URI=mongodb://localhost:27017/nutrition-tracker

# 伺服器
PORT=5000
NODE_ENV=development

# JWT 認證（生產環境應該更改）
JWT_SECRET=your_secure_secret_key_here_change_in_production

# 外部 API
TFDA_API_BASE=https://open.lis.ntu.edu.tw/api
OPEN_FOOD_FACTS_API=https://world.openfoodfacts.org/api/v0
```

#### 2.3 啟動 MongoDB

**選項 A: 本機 MongoDB**

如果你已安裝 MongoDB：

```bash
# macOS (使用 Homebrew)
brew services start mongodb-community

# Linux (使用 systemd)
sudo systemctl start mongod

# Windows (在 PowerShell 以管理員身份運行)
net start MongoDB
```

驗證連接：
```bash
mongosh
# 或舊版本
mongo
```

**選項 B: Docker MongoDB**

```bash
docker run -d \
  --name nutrition-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo

# 更新 .env 中的 MONGODB_URI
MONGODB_URI=mongodb://admin:password@localhost:27017/nutrition-tracker?authSource=admin
```

**選項 C: MongoDB Atlas (雲端)**

1. 訪問 https://www.mongodb.com/cloud/atlas
2. 建立免費帳戶
3. 建立新的 Cluster
4. 獲取連接字符串
5. 更新 `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutrition-tracker?retryWrites=true&w=majority
```

#### 2.4 啟動後端伺服器

```bash
# 正式模式
npm start

# 開發模式（自動重載）
npm run dev
```

預期輸出：
```
MongoDB 已連接
伺服器執行在 http://localhost:5000
```

測試後端：
```bash
curl http://localhost:5000/api/health

# 預期回應
{
  "success": true,
  "message": "Health check passed",
  "data": {"status": "healthy"}
}
```

### 步驟 3: 前端設置

#### 3.1 安裝依賴

打開新的終端窗口：

```bash
cd frontend
npm install
```

#### 3.2 配置環境變數

複製範本文件：
```bash
cp .env.example .env
```

編輯 `.env` 文件：

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3.3 啟動前端應用

```bash
npm start
```

預期輸出：
```
Compiled successfully!

You can now view nutrition-tracker in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

應用應自動在瀏覽器中打開：http://localhost:3000

---

## 驗證安裝

### 檢查清單

- [ ] 後端伺服器運行在 `http://localhost:5000`
- [ ] 前端應用運行在 `http://localhost:3000`
- [ ] 可以訪問健康檢查端點: `http://localhost:5000/api/health`
- [ ] 可以打開前端登入頁面
- [ ] 資料庫已連接（檢查後端日誌）

### 測試後端 API

使用 curl 或 Postman 測試：

```bash
# 1. 健康檢查
curl http://localhost:5000/api/health

# 2. 用戶註冊
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# 3. 用戶登入
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 4. 獲取所有食物
curl http://localhost:5000/api/foods
```

---

## 常見問題排查

### 問題 1: MongoDB 連接失敗

**症狀**:
```
MongoDB 連線錯誤: MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**解決方案**:
1. 確認 MongoDB 已安裝: `mongosh`
2. 啟動 MongoDB 服務
3. 檢查 `.env` 中的 `MONGODB_URI` 是否正確
4. 檢查防火牆設置

### 問題 2: 端口已被佔用

**症狀**:
```
Error: listen EADDRINUSE: address already in use :::5000
```

**解決方案**:

```bash
# 查找佔用 5000 端口的進程
lsof -i :5000

# 強制終止進程
kill -9 <PID>

# 或改用其他端口，編輯 .env
PORT=5001
```

### 問題 3: 前端無法連接後端

**症狀**:
```
GET http://localhost:5000/api/foods 404 (Not Found)
```

**解決方案**:
1. 確認後端伺服器在運行: `npm start`
2. 檢查 `frontend/.env` 中的 `REACT_APP_API_URL`
3. 檢查後端 CORS 設置是否允許前端來源
4. 查看瀏覽器開發者工具的 Network 標籤

### 問題 4: 包版本衝突

**症狀**:
```
npm ERR! peer dep missing
```

**解決方案**:
```bash
# 清除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json

# 重新安裝
npm install
```

### 問題 5: 認證失敗

**症狀**:
```
無效的 token
401 Unauthorized
```

**解決方案**:
1. 確認登入成功並獲取 token
2. 檢查 Authorization header 格式: `Bearer <token>`
3. 檢查 token 是否過期（有效期 30 天）
4. 在 localStorage 中驗證 token 是否存在

---

## 開發工作流

### 目錄結構提醒

```
nutrition-tracker/
├── backend/
│   ├── controllers/      # 請求處理
│   ├── models/          # 資料模型
│   ├── routes/          # API 路由
│   ├── utils/           # 工具函數
│   ├── server.js        # 應用入口
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/   # UI 元件
│   │   ├── pages/       # 頁面
│   │   ├── context/     # 狀態管理
│   │   ├── services/    # API 調用
│   │   ├── styles/      # CSS 樣式
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env
│
└── docs/
    ├── README.md
    ├── API-SPEC.md
    ├── ARCHITECTURE.md
    └── DESIGN-PATTERNS.md
```

### 常用開發命令

**後端**:
```bash
cd backend

# 啟動開發伺服器
npm run dev

# 執行生產模式
npm start

# 安裝新依賴
npm install <package-name>
```

**前端**:
```bash
cd frontend

# 啟動開發伺服器
npm start

# 構建生產版本
npm run build

# 執行測試
npm test

# 安裝新依賴
npm install <package-name>
```

---

## 使用 Postman 測試 API

1. **下載 Postman**: https://www.postman.com/downloads/
2. **匯入 API 集合**:
   - 建立新的 Postman Collection
   - 添加請求到各個 API 端點
   - 保存收集

**範例 Postman 流程**:
```
1. POST /users/register → 獲取 token
2. POST /foods → 建立食物
3. GET /foods → 獲取食物列表
4. POST /records → 建立飲食記錄
5. GET /records → 查詢用戶記錄
```

---

## 下一步

1. ✅ 啟動後端和前端伺服器
2. 👤 在應用中建立帳戶
3. 🍎 添加第一筆飲食記錄
4. 📊 查看統計資訊
5. 🔄 測試 CRUD 操作

詳細 API 文件見: [API-SPEC.md](../docs/API-SPEC.md)

---

## 支持

如有任何問題，請：
1. 檢查此文件的 FAQ 部分
2. 查看項目 Issues
3. 查閱 API 文件: [API-SPEC.md](../docs/API-SPEC.md)
4. 查閱架構文件: [ARCHITECTURE.md](../docs/ARCHITECTURE.md)

