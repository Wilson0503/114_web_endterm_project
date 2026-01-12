# 飲食記錄系統 - 測試和部署指南

## 測試策略

### 單元測試

#### 後端單元測試

```javascript
// tests/controllers/userController.test.js
const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');

describe('User Controller', () => {
  describe('POST /api/users/register', () => {
    it('應該成功註冊新用戶', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('應該拒絕密碼不匹配', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password456'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/users/login', () => {
    it('應該成功登入用戶', async () => {
      // 先建立用戶
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword'
      });

      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('應該拒絕無效的郵箱', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(404);
    });
  });
});
```

#### 前端單元測試

```javascript
// src/components/__tests__/Auth.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { Login } from '../../components/Auth';

describe('Login Component', () => {
  it('應該呈現登入表單', () => {
    render(
      <AuthProvider>
        <Login onSwitchToRegister={() => {}} />
      </AuthProvider>
    );
    
    expect(screen.getByLabelText(/郵箱/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密碼/i)).toBeInTheDocument();
  });

  it('應該在提交時顯示載入狀態', async () => {
    render(
      <AuthProvider>
        <Login onSwitchToRegister={() => {}} />
      </AuthProvider>
    );
    
    const emailInput = screen.getByLabelText(/郵箱/i);
    const passwordInput = screen.getByLabelText(/密碼/i);
    const submitBtn = screen.getByRole('button', { name: /登入/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(submitBtn.textContent).toContain('登入中');
    });
  });
});
```

### 整合測試

```javascript
// tests/integration/crud.test.js
describe('完整 CRUD 流程', () => {
  let token;
  let userId;
  let foodId;
  let recordId;

  beforeAll(async () => {
    // 1. 註冊和登入
    const registerRes = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });

    token = registerRes.body.data.token;
    userId = registerRes.body.data.userId;
  });

  test('完整的飲食記錄 CRUD', async () => {
    // Create Food
    const createFoodRes = await request(app)
      .post('/api/foods')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '雞胸肉',
        calories: 165,
        protein: 31
      });

    foodId = createFoodRes.body.data._id;
    expect(createFoodRes.statusCode).toBe(201);

    // Create Record
    const createRecordRes = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${token}`)
      .send({
        foodId,
        quantity: 1.5,
        mealType: 'lunch'
      });

    recordId = createRecordRes.body.data._id;
    expect(createRecordRes.statusCode).toBe(201);
    expect(createRecordRes.body.data.totalCalories).toBe(248);

    // Read Record
    const getRecordRes = await request(app)
      .get(`/api/records/${recordId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRecordRes.statusCode).toBe(200);

    // Update Record
    const updateRecordRes = await request(app)
      .put(`/api/records/${recordId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 2 });

    expect(updateRecordRes.statusCode).toBe(200);
    expect(updateRecordRes.body.data.totalCalories).toBe(330);

    // Delete Record
    const deleteRecordRes = await request(app)
      .delete(`/api/records/${recordId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRecordRes.statusCode).toBe(200);
  });
});
```

---

## 部署指南

### 環境設置

#### 生產環境配置 (.env)

```env
# Node
NODE_ENV=production

# 資料庫 (使用 MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutrition-tracker?retryWrites=true&w=majority

# 伺服器
PORT=5000  # 建議後端使用 5000，避免與 React 開發伺服器（3000）衝突

# 安全
JWT_SECRET=your_super_secure_secret_key_that_is_at_least_32_characters_long

# 外部 API
TFDA_API_BASE=https://open.lis.ntu.edu.tw/api
OPEN_FOOD_FACTS_API=https://world.openfoodfacts.org/api/v0

# CORS
CORS_ORIGIN=https://yourdomain.com
```

### 後端部署

#### 選項 1: Heroku

1. **安裝 Heroku CLI** (macOS 建議使用 Homebrew):
```bash
brew tap heroku/brew
brew install heroku
heroku login
```

2. **初始化 Heroku 應用**:
```bash
heroku create nutrition-tracker-api
```

3. **設定環境變數**:
```bash
heroku config:set NODE_ENV=production \
  JWT_SECRET=your_secret_key \
  MONGODB_URI=your_mongodb_uri
```

4. **部署**:
```bash
git push heroku main
```

#### 選項 2: Railway

1. **連接 GitHub**:
- 訪問 https://railway.app
- 連接你的 GitHub 帳戶
- 選擇你的存儲庫

2. **配置**:
- 設定環境變數
- 設定啟動命令: `npm start`

3. **自動部署**:
- 推送到 main 分支自動部署

#### 選項 3: AWS EC2

1. **啟動 EC2 實例**:
```bash
# 安裝 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 克隆存儲庫
git clone your-repo
cd nutrition-tracker/backend

# 安裝依賴
npm install

# 使用 PM2 管理進程
npm install -g pm2
pm2 start server.js --name "nutrition-api"
pm2 startup
pm2 save
```

### 前端部署

#### 選項 1: Vercel

1. **連接 GitHub**:
- 訪問 https://vercel.com
- 連接 GitHub 帳戶
- 選擇存儲庫

2. **配置構建設定**:
- 根目錄: `frontend`
- 構建命令: `npm run build`
- 輸出目錄: `build`

3. **設定環境變數**:
```
REACT_APP_API_URL=https://your-api-domain.com/api
```

4. **自動部署**:
- 推送到 main 分支自動部署

#### 選項 2: Netlify

1. **連接 GitHub**:
- 訪問 https://app.netlify.com
- 連接 GitHub
- 選擇存儲庫

2. **構建設定**:
- 根目錄: `frontend`
- 構建命令: `npm run build`
- 發佈目錄: `build`

3. **環境變數**:
```
REACT_APP_API_URL=https://your-api-domain.com/api
```

#### 選項 3: GitHub Pages

1. **修改 package.json**:
```json
{
  "homepage": "https://yourusername.github.io/nutrition-tracker",
  "scripts": {
    "build": "react-scripts build",
    "deploy": "gh-pages -d build"
  }
}
```

2. **安裝和部署**:
```bash
npm install --save-dev gh-pages
npm run build
npm run deploy
```

### 資料庫部署

#### MongoDB Atlas (推薦用於生產)

1. **建立帳戶**:
- 訪問 https://www.mongodb.com/cloud/atlas
- 建立免費帳戶

2. **建立 Cluster**:
- 選擇雲端提供商 (AWS, Google Cloud, Azure)
- 選擇區域 (靠近用戶)
- 建立 M0 免費層

3. **配置網路訪問**:
- 添加你的 IP 地址
- 或允許所有 (0.0.0.0/0)

4. **建立資料庫用戶**:
- 設定用戶名和密碼
- 獲取連接字符串

5. **更新 .env**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutrition-tracker?retryWrites=true&w=majority
```

---

## 部署檢查清單

### 部署前

- [ ] 所有測試通過
- [ ] 代碼審查完成
- [ ] 環境變數已配置
- [ ] 資料庫已準備
- [ ] HTTPS 已啟用
- [ ] 備份策略已就位

### 部署後

- [ ] 訪問應用，驗證功能
- [ ] 檢查日誌，確保無錯誤
- [ ] 測試所有 API 端點
- [ ] 驗證資料庫連接
- [ ] 檢查性能指標
- [ ] 設定監控和告警

---

## 監控和維護

### 日誌監控

```bash
# Heroku 日誌
heroku logs --tail

# PM2 日誌
pm2 logs

# 查看特定應用日誌
pm2 logs nutrition-api
```

### 性能監控

使用 New Relic 或 DataDog：

```javascript
// server.js
const newrelic = require('newrelic');

app.use(newrelic.middleware.express());
```

### 備份策略

```bash
# MongoDB 備份
mongodump --uri="your_mongodb_uri" --out=/path/to/backup

# 定期備份 (使用 cron)
0 2 * * * /backup-script.sh
```

---

## 故障排查

### 常見部署問題

**問題 1: 應用崩潰**
```bash
# 查看日誌
heroku logs --tail

# 重啟應用
heroku restart
```

**問題 2: 資料庫連接失敗**
- 檢查 IP 白名單
- 驗證連接字符串
- 檢查防火牆設置

**問題 3: 環境變數未讀取**
```bash
# 重新部署
git push heroku main

# 驗證環境變數
heroku config
```

---

## 性能優化

### 後端優化

```javascript
// 使用 gzip 壓縮
const compression = require('compression');
app.use(compression());

// 使用緩存
const redis = require('redis');
const client = redis.createClient();

// 限制速率
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100 // 每個 IP 100 個請求
});
app.use('/api/', limiter);
```

### 前端優化

```javascript
// 代碼分割
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// 圖像優化
<img src={imageUrl} loading="lazy" alt="description" />

// 緩存策略
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

---

## 參考資源

- [Heroku 部署指南](https://devcenter.heroku.com/)
- [Vercel 部署指南](https://vercel.com/docs)
- [MongoDB Atlas 文件](https://docs.atlas.mongodb.com/)
- [React 優化](https://react.dev/reference/react/Profiler)
- [Node.js 最佳實踐](https://nodejs.org/en/docs/guides/nodejs-performance/)

