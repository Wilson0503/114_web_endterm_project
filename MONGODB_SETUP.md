# MongoDB 設置指南

## 快速設置 (3 分鐘)

### 1. 註冊 MongoDB Atlas

訪問: https://www.mongodb.com/cloud/atlas/register

- 選擇免費方案 (Free Tier)
- 輸入郵箱和密碼

### 2. 建立集群

1. 登入後，點擊 "Create" 建立新項目
2. 選擇 "Build a Database"
3. 選擇 "M0 Free" 方案
4. 選擇區域 (建議選擇離你最近的區域)
5. 點擊 "Create"
6. 等待集群建立 (約 2-3 分鐘)

### 3. 設置連接

1. 點擊 "Connect"
2. 選擇 "Drivers"
3. 選擇 "Node.js"
4. 複製連接字符串

連接字符串格式如下：
```
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority
```

### 4. 更新 `.env` 文件

編輯 `backend/.env`，找到這一行：

```dotenv
MONGODB_URI=mongodb://localhost:27017/nutrition-tracker
```

替換為：

```dotenv
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster-name>.mongodb.net/nutrition-tracker?retryWrites=true&w=majority
```

**例如：**
```dotenv
MONGODB_URI=mongodb+srv://myuser:mypassword123@nutrition-tracker.abc123.mongodb.net/nutrition-tracker?retryWrites=true&w=majority
```

### 5. 測試連接

重新啟動後端伺服器：

```bash
cd backend
npm run dev
```

終端應該顯示：
```
MongoDB 已連接
伺服器執行在 http://localhost:5000
```

**備註（本地 vs 雲端 TFDA）**

本專案包含一份本地的 TFDA 範例資料 `backend/data/tfdaFoods.js`，預設程式會從該本地資料查詢台灣食品。如你想要呼叫線上 TFDA API，請在 `backend/.env` 設定 `TFDA_API_BASE` 並在 `backend/utils/externalApis.js` 中啟用對應的 HTTP 呼叫。

---

## 常見問題

### Q: 連接字符串中密碼包含特殊字符怎麼辦？

**A:** 需要進行 URL 編碼。例如：
- `@` 變成 `%40`
- `#` 變成 `%23`
- 使用線上工具: https://www.urlencode.org/

### Q: 為什麼還是連接失敗？

檢查清單：
- [ ] 複製了完整的連接字符串
- [ ] 替換了 `<username>` 和 `<password>`
- [ ] 沒有包含 `<` 和 `>`
- [ ] 白名單中添加了你的 IP 地址

### Q: 在 MongoDB Atlas 中添加 IP 白名單

1. 登入 MongoDB Atlas
2. 點擊 "Network Access"
3. 點擊 "Add IP Address"
4. 輸入 `0.0.0.0/0` (允許任何 IP) 或你的具體 IP
5. 點擊 "Confirm"

---

### 替代方案：本機安裝 MongoDB

如果你想使用本機 MongoDB：

### macOS (使用 Homebrew)

```bash
# 安裝 MongoDB
brew tap mongodb/brew
brew install mongodb-community

# 啟動 MongoDB
brew services start mongodb-community

# 建議使用 mongosh 互動
mongosh

# 驗證
brew services list
```

### Ubuntu/Debian

```bash
# 安裝 MongoDB（請參考官方套件來源以取得較新版本）
sudo apt-get install mongodb

# 啟動 MongoDB（服務名稱常為 mongod）
sudo systemctl start mongod

# 驗證
sudo systemctl status mongod
```

### Windows

下載安裝程序: https://www.mongodb.com/try/download/community

---

## 測試數據庫連接

運行以下命令測試後端：

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "123456",
    "confirmPassword": "123456"
  }'
```

預期回應：
```json
{
  "success": true,
  "message": "註冊成功",
  "data": {
    "userId": "...",
    "username": "testuser",
    "email": "test@example.com",
    "token": "..."
  },
  "timestamp": "2024-01-09T09:00:00.000Z"
}
```

---

## 完成！

現在您可以：

1. 啟動後端：`cd backend && npm run dev`
2. 啟動前端：`cd frontend && npm start`
3. 訪問應用：http://localhost:3000
4. 嘗試註冊新用戶並進行測試

祝您使用愉快！🎉
