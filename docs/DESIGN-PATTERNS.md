# 飲食記錄系統 - 設計模式應用指南

## 概述

本項目應用了多個軟體設計模式，以提高程式碼的可維護性、可擴展性和可測試性。

---

## 後端設計模式

### 1. Repository Pattern (存儲庫模式)

**目的**: 將資料存取邏輯與業務邏輯分離

**實現位置**: `backend/controllers/` 和 `backend/models/`

**示例**:
```javascript
// controllers/foodController.js
const createFood = async (req, res) => {
  // 驗證和業務邏輯
  const newFood = new Food(foodData);  // 透過 Mongoose 模型進行存取
  await newFood.save();
  // 回應處理
};
```

**優點**:
- 隔離資料存取邏輯
- 便於單元測試
- 易於替換資料庫實現

---

### 2. Middleware Pattern (中間件模式)

**目的**: 在請求處理流程中插入橫切關注點

**實現位置**: `backend/server.js`

**示例**:
```javascript
// 統一回應格式中間件
app.use((req, res, next) => {
  res.sendSuccess = (data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  };
  next();
});

// 認證中間件
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendError('缺少授權 token', 401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.sendError('無效的 token', 401);
  }
};
```

**應用場景**:
- 認證和授權
- 日誌記錄
- 錯誤處理
- 請求驗證
- 統一回應格式

**優點**:
- 代碼復用
- 顧慮分離
- 易於測試

---

### 3. Service Pattern (服務模式)

**目的**: 將複雜的業務邏輯和外部服務整合封裝為獨立服務

**實現位置**: `backend/utils/externalApis.js`

**示例**:
```javascript
// 外部 API 服務
const searchOpenFoodFactsByBarcode = async (barcode) => {
  try {
    const response = await axios.get(
      `${process.env.OPEN_FOOD_FACTS_API}/product/${barcode}.json`
    );
    // 資料轉換和返回
    return {
      name: product.product_name,
      calories: product.nutriments?.['energy-kcal'],
      source: 'open_food_facts',
      sourceId: barcode
    };
  } catch (error) {
    console.error('Open Food Facts API 錯誤:', error);
    return null;
  }
};
```

**優點**:
- 外部依賴隔離
- 易於測試和模擬
- 便於切換不同的服務提供商

---

### 4. MVC Pattern (模型-視圖-控制器)

**目的**: 將應用分為三層，各層各司其職

**結構**:
```
Models (backend/models/)
  ├─ User.js
  ├─ Food.js
  └─ Record.js

Controllers (backend/controllers/)
  ├─ userController.js
  ├─ foodController.js
  └─ recordController.js

Routes (backend/routes/)
  ├─ userRoutes.js
  ├─ foodRoutes.js
  └─ recordRoutes.js
```

**優點**:
- 清晰的代碼結構
- 便於團隊協作
- 易於維護和擴展

---

## 前端設計模式

### 1. Context API Pattern (上下文 API 模式)

**目的**: 管理應用全局狀態，避免 Prop Drilling

**實現位置**: `frontend/src/context/`

**示例**:
```javascript
// AuthContext.js
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    const res = await userApi.login({ email, password });
    const { token, ...userData } = res.data.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth 必須在 AuthProvider 內使用');
  return context;
};
```

**應用場景**:
- 用戶認證狀態
- 食物資料緩存
- 主題設定
- 語言選擇

**優點**:
- 避免深層 prop 傳遞
- 集中狀態管理
- 提高代碼可讀性

---

### 2. Component Composition Pattern (元件組合模式)

**目的**: 構建可復用、職責單一的 UI 元件

**實現位置**: `frontend/src/components/`

**示例**:
```javascript
// 單一職責元件
export const RecordForm = ({ onRecordCreated }) => {
  // 用於新增飲食記錄的表單邏輯
};

export const RecordList = ({ refreshTrigger }) => {
  // 用於顯示飲食記錄列表的邏輯
};

// 組合元件
export default function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div>
      <RecordForm onRecordCreated={() => setRefreshTrigger(prev => prev + 1)} />
      <RecordList refreshTrigger={refreshTrigger} />
    </div>
  );
}
```

**優點**:
- 元件復用性高
- 職責單一
- 易於測試
- 便於維護

---

### 3. Custom Hooks Pattern (自訂 Hooks 模式)

**目的**: 提取和復用複雜的組件邏輯

**實現位置**: `frontend/src/context/AuthContext.js`, `frontend/src/context/FoodContext.js`

**示例**:
```javascript
// useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必須在 AuthProvider 內使用');
  }
  return context;
};

// 使用 hook
function MyComponent() {
  const { user, login, logout } = useAuth();
  // ...
}
```

**優點**:
- 邏輯復用
- 減少代碼重複
- 提高可維護性

---

### 4. Container/Presentational Pattern (容器/展示模式)

**目的**: 將邏輯和展示分離

**示例**:
```javascript
// 容器元件 (Container) - 處理邏輯
function RecordListContainer({ date }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords(date);
  }, [date]);

  const handleDelete = async (id) => {
    await deleteRecord(id);
    setRecords(records.filter(r => r._id !== id));
  };

  return <RecordListPresentation records={records} onDelete={handleDelete} />;
}

// 展示元件 (Presentational) - 只負責渲染
function RecordListPresentation({ records, onDelete }) {
  return (
    <div>
      {records.map(record => (
        <div key={record._id}>
          <h3>{record.foodId.name}</h3>
          <button onClick={() => onDelete(record._id)}>刪除</button>
        </div>
      ))}
    </div>
  );
}
```

**優點**:
- 邏輯和展示分離
- 元件復用性高
- 便於測試

---

## 設計模式對比

| 模式 | 層級 | 用途 | 優點 | 缺點 |
|------|------|------|------|------|
| Repository | 後端 | 資料層抽象 | 易測試、易切換 | 增加複雜度 |
| Middleware | 後端 | 橫切關注點 | 代碼復用、清晰 | 調試困難 |
| Service | 後端 | 業務邏輯 | 易維護、易擴展 | 可能過度設計 |
| Context | 前端 | 狀態管理 | 避免 prop drilling | 性能可能下降 |
| Composition | 前端 | UI 構建 | 高復用性 | 可能過度分離 |
| Custom Hooks | 前端 | 邏輯復用 | 代碼復用、清晰 | 依賴複雜 |

---

## 最佳實踐建議

### 後端

1. **使用 Repository Pattern 進行資料存取**
   ```javascript
   // 好
   class UserRepository {
     async findById(id) { /* ... */ }
     async save(user) { /* ... */ }
   }

   // 不好
   // 直接在 controller 中寫資料庫查詢
   ```

2. **充分利用中間件進行請求處理**
   - 認證檢查
   - 輸入驗證
   - 錯誤處理
   - 日誌記錄

3. **將外部 API 調用封裝為服務**
   - 便於測試
   - 易於替換
   - 錯誤處理集中

### 前端

1. **使用 Context API 管理全局狀態**
   ```javascript
   <AuthProvider>
     <App />
   </AuthProvider>
   ```

2. **保持元件小而專一**
   - 一個元件一個職責
   - 易於測試和復用

3. **使用自訂 Hooks 提取複雜邏輯**
   ```javascript
   const { data, loading, error } = useFetch(url);
   ```

4. **區分容器元件和展示元件**
   - 容器: 邏輯、狀態管理
   - 展示: 只負責渲染

---

## 性能考慮

### 避免的做法

1. ❌ 在 render 中創建新物件
2. ❌ 深層 prop 傳遞（使用 Context）
3. ❌ 不必要的重新渲染
4. ❌ 在迴圈中建立新函數

### 推薦做法

1. ✅ 使用 React.memo 緩存元件
2. ✅ 使用 useCallback 緩存函數
3. ✅ 使用 useMemo 緩存計算結果
4. ✅ 代碼分割和懶加載

---

## 參考資源

- [React 官方文檔 - Design Patterns](https://react.dev/)
- [JavaScript Design Patterns](https://www.patterns.dev/posts/javascript-patterns/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Design Patterns](https://www.mongodb.com/blog/post/multi-tenant-architecture)

