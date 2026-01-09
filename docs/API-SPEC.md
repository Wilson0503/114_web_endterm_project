# 飲食記錄系統 - API 規格文件

## 基本資訊

- **基礎 URL**: `http://localhost:5000/api`
- **內容類型**: `application/json`
- **認證**: Bearer Token（JWT）

---

## API 端點

### 用戶管理 (`/users`)

#### 1. 用戶註冊
**POST** `/users/register`

**請求**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**成功回應 (201)**:
```json
{
  "success": true,
  "message": "註冊成功",
  "data": {
    "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 2. 用戶登入
**POST** `/users/login`

**請求**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "登入成功",
  "data": {
    "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 3. 獲取當前用戶資訊
**GET** `/users/me`

**認證**: 需要

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "獲取用戶資訊成功",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-09T10:00:00.000Z"
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 4. 更新用戶資訊
**PUT** `/users/me`

**認證**: 需要

**請求**:
```json
{
  "username": "john_doe_updated",
  "email": "newemail@example.com"
}
```

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "用戶資訊已更新",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe_updated",
    "email": "newemail@example.com"
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 5. 獲取用戶統計
**GET** `/users/stats`

**認證**: 需要

**查詢參數**:
- `startDate` (可選): 開始日期 (ISO 格式)
- `endDate` (可選): 結束日期 (ISO 格式)

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "獲取統計資訊成功",
  "data": {
    "totalRecords": 15,
    "totalCalories": 4250,
    "avgCaloriesPerDay": 2125,
    "recordsByMealType": {
      "breakfast": 5,
      "lunch": 5,
      "dinner": 4,
      "snack": 1
    }
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

---

### 食物管理 (`/foods`)

#### 1. 建立食物
**POST** `/foods`

**認證**: 需要

**請求**:
```json
{
  "name": "雞胸肉",
  "calories": 165,
  "protein": 31,
  "carbs": 0,
  "fat": 3.6,
  "servingSize": "100克"
}
```

**成功回應 (201)**:
```json
{
  "success": true,
  "message": "食物已建立",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
    "name": "雞胸肉",
    "calories": 165,
    "protein": 31,
    "carbs": 0,
    "fat": 3.6,
    "servingSize": "100克",
    "source": "user",
    "isPublic": true,
    "createdAt": "2024-01-09T10:30:00.000Z"
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 2. 獲取所有食物
**GET** `/foods`

**認證**: 不需要

**查詢參數**:
- `search` (可選): 搜尋食物名稱
- `source` (可選): 篩選來源 (user, tfda, open_food_facts)

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "獲取食物清單成功",
  "data": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "name": "雞胸肉",
      "calories": 165,
      "protein": 31,
      "carbs": 0,
      "fat": 3.6,
      "servingSize": "100克",
      "source": "user",
      "isPublic": true,
      "createdAt": "2024-01-09T10:30:00.000Z"
    }
  ],
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 3. 獲取特定食物
**GET** `/foods/:id`

**認證**: 不需要

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "獲取食物資訊成功",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
    "name": "雞胸肉",
    "calories": 165,
    "protein": 31,
    "carbs": 0,
    "fat": 3.6,
    "servingSize": "100克",
    "source": "user",
    "isPublic": true,
    "createdAt": "2024-01-09T10:30:00.000Z"
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 4. 更新食物
**PUT** `/foods/:id`

**認證**: 需要

**請求**:
```json
{
  "name": "雞胸肉（更新）",
  "calories": 170,
  "protein": 32,
  "carbs": 0,
  "fat": 3.6,
  "servingSize": "100克"
}
```

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "食物已更新",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
    "name": "雞胸肉（更新）",
    "calories": 170,
    "protein": 32,
    "carbs": 0,
    "fat": 3.6,
    "servingSize": "100克",
    "source": "user",
    "updatedAt": "2024-01-09T10:35:00.000Z"
  },
  "timestamp": "2024-01-09T10:35:00.000Z"
}
```

#### 5. 刪除食物
**DELETE** `/foods/:id`

**認證**: 需要

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "食物已刪除",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
    "name": "雞胸肉",
    "calories": 165
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 6. 按名稱搜尋食物
**GET** `/foods/search/name`

**認證**: 不需要

**查詢參數**:
- `name` (必要): 食物名稱

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "搜尋結果",
  "data": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "name": "雞胸肉",
      "calories": 165
    }
  ],
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 7. 按條碼搜尋食物（Open Food Facts）
**GET** `/foods/search/barcode/:barcode`

**認證**: 不需要

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "找到食物資料",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "name": "產品名稱",
    "calories": 250,
    "protein": 5,
    "carbs": 50,
    "fat": 10,
    "source": "open_food_facts",
    "sourceId": "0012345678901"
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

---

### 飲食記錄 (`/records`)

#### 1. 建立飲食記錄
**POST** `/records`

**認證**: 需要

**請求**:
```json
{
  "foodId": "64a1b2c3d4e5f6g7h8i9j0k2",
  "quantity": 1.5,
  "mealType": "lunch",
  "recordedAt": "2024-01-09T12:30:00.000Z",
  "notes": "搭配米飯"
}
```

**成功回應 (201)**:
```json
{
  "success": true,
  "message": "飲食記錄已建立",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
    "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "foodId": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "name": "雞胸肉",
      "calories": 165
    },
    "quantity": 1.5,
    "mealType": "lunch",
    "totalCalories": 248,
    "notes": "搭配米飯",
    "recordedAt": "2024-01-09T12:30:00.000Z",
    "createdAt": "2024-01-09T10:30:00.000Z"
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 2. 獲取用戶所有記錄
**GET** `/records`

**認證**: 需要

**查詢參數**:
- `startDate` (可選): 開始日期 (ISO 格式)
- `endDate` (可選): 結束日期 (ISO 格式)
- `mealType` (可選): 用餐類型 (breakfast, lunch, dinner, snack)

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "獲取記錄清單成功",
  "data": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
      "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
      "foodId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "name": "雞胸肉",
        "calories": 165
      },
      "quantity": 1.5,
      "mealType": "lunch",
      "totalCalories": 248,
      "recordedAt": "2024-01-09T12:30:00.000Z"
    }
  ],
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 3. 獲取特定記錄
**GET** `/records/:id`

**認證**: 需要

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "獲取記錄成功",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
    "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "foodId": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "name": "雞胸肉",
      "calories": 165
    },
    "quantity": 1.5,
    "mealType": "lunch",
    "totalCalories": 248,
    "recordedAt": "2024-01-09T12:30:00.000Z"
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 4. 更新記錄
**PUT** `/records/:id`

**認證**: 需要

**請求**:
```json
{
  "quantity": 2,
  "mealType": "lunch",
  "notes": "更新的備註"
}
```

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "記錄已更新",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
    "quantity": 2,
    "totalCalories": 330,
    "mealType": "lunch",
    "updatedAt": "2024-01-09T10:35:00.000Z"
  },
  "timestamp": "2024-01-09T10:35:00.000Z"
}
```

#### 5. 刪除記錄
**DELETE** `/records/:id`

**認證**: 需要

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "記錄已刪除",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
    "totalCalories": 248
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

#### 6. 獲取特定日期統計
**GET** `/records/stats/day`

**認證**: 需要

**查詢參數**:
- `date` (必要): 日期 (yyyy-MM-dd 格式)

**成功回應 (200)**:
```json
{
  "success": true,
  "message": "獲取日期統計成功",
  "data": {
    "date": "2024-01-09",
    "totalCalories": 2150,
    "mealBreakdown": {
      "breakfast": { "count": 2, "calories": 450 },
      "lunch": { "count": 2, "calories": 850 },
      "dinner": { "count": 1, "calories": 700 },
      "snack": { "count": 2, "calories": 150 }
    },
    "records": [...]
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

---

## 錯誤回應

所有錯誤都遵循統一格式：

```json
{
  "success": false,
  "message": "錯誤訊息",
  "error": "詳細的錯誤資訊",
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

### 常見 HTTP 狀態碼

| 狀態碼 | 說明 |
|--------|------|
| 200 | 成功 |
| 201 | 資源已建立 |
| 400 | 請求格式錯誤 |
| 401 | 未授權 |
| 403 | 禁止訪問 |
| 404 | 資源不存在 |
| 409 | 衝突（如用戶名已存在） |
| 500 | 伺服器錯誤 |

---

## 認證

使用 JWT Bearer Token 進行認證。在 `Authorization` header 中包含 token：

```
Authorization: Bearer <your_jwt_token>
```

Token 有效期為 30 天。

---

## 資料限制

- 密碼最少 6 個字符
- 用戶名最少 3 個字符，最多 50 個字符
- 食物名稱最多 200 個字符
- 記錄備註最多 500 個字符
- 份量最小 0.1，最大 100

---

## 範例請求

### 使用 curl

```bash
# 註冊
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# 登入
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# 建立食物（需要 token）
curl -X POST http://localhost:5000/api/foods \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "雞胸肉",
    "calories": 165,
    "protein": 31,
    "carbs": 0,
    "fat": 3.6,
    "servingSize": "100克"
  }'
```

---

## 健康檢查

**GET** `/health`

用於檢查 API 伺服器是否運行：

```json
{
  "success": true,
  "message": "Health check passed",
  "data": { "status": "healthy" },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```
