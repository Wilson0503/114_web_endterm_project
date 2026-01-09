import React, { useState, useEffect } from 'react';
import { recordApi, foodApi } from '../services/api';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import '../styles/RecordForm.css';

export const RecordForm = ({ onRecordCreated }) => {
  const [formData, setFormData] = useState({
    foodId: '',
    quantity: 1,
    mealType: 'lunch',
    recordedAt: format(new Date(), 'yyyy-MM-dd')
  });

  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchSource, setSearchSource] = useState('all'); // all, local, tfda, open_food_facts

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await foodApi.getAllFoods({ limit: 50 });
      setFoods(res.data.data);
    } catch (err) {
      console.error('獲取食物列表失敗', err);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      try {
        setLoading(true);
        // 搜尋本地、TFDA 和 Open Food Facts 的食物
        const res = await foodApi.searchByName(query);
        const results = res.data.data || [];
        
        // 按來源排序，優先顯示本地食物
        const sorted = results.sort((a, b) => {
          const sourceOrder = { user: 0, tfda: 1, open_food_facts: 2 };
          return (sourceOrder[a.source] || 3) - (sourceOrder[b.source] || 3);
        });
        
        setSearchResults(sorted);
        setShowSearchResults(true);
      } catch (err) {
        console.error('搜尋失敗', err);
      } finally {
        setLoading(false);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  const handleBarcodeSearch = async () => {
    const barcode = prompt('請輸入商品條碼:');
    if (barcode) {
      try {
        setLoading(true);
        const res = await foodApi.searchByBarcode(barcode);
        if (res.data.data) {
          setSearchResults([res.data.data]);
          setSearchQuery(res.data.data.name);
          setShowSearchResults(true);
        }
      } catch (err) {
        setError('條碼未找到，請嘗試搜尋食物名稱');
      } finally {
        setLoading(false);
      }
    }
  };

  const getSourceBadge = (source) => {
    const sourceMap = {
      user: { label: '自訂', color: '#4CAF50' },
      tfda: { label: '衛福部食藥署', color: '#2196F3' },
      open_food_facts: { label: 'Open Food Facts', color: '#FF9800' }
    };
    return sourceMap[source] || { label: '其他', color: '#999' };
  };

  const handleSelectFood = (food) => {
    const select = async () => {
      // 如果 food 已有 _id，直接選取；否則先建立到後端，再使用回傳的 _id
      if (food._id) {
        setFormData(prev => ({ ...prev, foodId: food._id }));
        setSearchQuery(food.name);
        setShowSearchResults(false);
        return;
      }

      try {
        setLoading(true);
        const payload = {
          name: food.name,
          calories: food.calories || 0,
          protein: food.protein || 0,
          carbs: food.carbs || 0,
          fat: food.fat || 0,
          servingSize: food.servingSize || '100克',
          source: food.source || 'tfda',
          sourceId: food.sourceId || null
        };

        const res = await foodApi.createFood(payload);
        const created = res.data.data;
        setFormData(prev => ({ ...prev, foodId: created._id }));
        setSearchQuery(created.name);
        setShowSearchResults(false);
      } catch (err) {
        console.error('建立食物失敗', err);
        setError('無法建立選取的食物，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    select();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.foodId) {
        setError('請選擇食物');
        return;
      }

      await recordApi.createRecord({
        ...formData,
        recordedAt: new Date(formData.recordedAt).toISOString()
      });

      setFormData({
        foodId: '',
        quantity: 1,
        mealType: 'lunch',
        recordedAt: format(new Date(), 'yyyy-MM-dd')
      });

      setSearchQuery('');
      
      if (onRecordCreated) {
        onRecordCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || '建立記錄失敗');
    } finally {
      setLoading(false);
    }
  };

  const selectedFood = foods.find(f => f._id === formData.foodId) ||
                       searchResults.find(f => f._id === formData.foodId);

  return (
    <div className="record-form">
      <h2>新增飲食記錄</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="food-search">搜尋食物</label>
          <div className="search-controls">
            <div className="search-container">
              <input
                type="text"
                id="food-search"
                placeholder="搜尋食物名稱..."
                value={searchQuery}
                onChange={handleSearch}
                autoComplete="off"
              />
              <button 
                type="button" 
                className="btn btn-secondary barcode-btn"
                onClick={handleBarcodeSearch}
                title="掃描條碼搜尋"
              >
                📱 條碼
              </button>
            </div>
            {loading && <p className="loading-text">搜尋中...</p>}
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(food => {
                  const source = getSourceBadge(food.source);
                  return (
                    <div
                      key={food._id || `${food.source}-${food.name}`}
                      className="search-result-item"
                      onClick={() => handleSelectFood(food)}
                    >
                      <div className="food-header">
                        <div className="food-name">{food.name}</div>
                        <span 
                          className="source-badge" 
                          style={{ backgroundColor: source.color }}
                        >
                          {source.label}
                        </span>
                      </div>
                      <div className="food-nutrition">
                        <span>{food.calories} kcal</span>
                        <span>{food.protein || 0}g 蛋白質</span>
                        <span>{food.carbs || 0}g 碳水</span>
                        <span>{food.fat || 0}g 脂肪</span>
                      </div>
                      <div className="food-serving">{food.servingSize}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {selectedFood && (
          <div className="selected-food-info">
            <p><strong>{selectedFood.name}</strong></p>
            <p>{selectedFood.calories} kcal / {selectedFood.servingSize}</p>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantity">份量</label>
            <div className="quantity-with-note">
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0.1"
                step="0.1"
                value={formData.quantity}
                onChange={handleChange}
              />
              <span className="serving-note">(一份 = {selectedFood?.servingSize || '100克'})</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mealType">用餐類型</label>
            <select
              id="mealType"
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
            >
              <option value="breakfast">早餐</option>
              <option value="lunch">午餐</option>
              <option value="dinner">晚餐</option>
              <option value="snack">點心</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="recordedAt">日期</label>
            <input
              type="date"
              id="recordedAt"
              name="recordedAt"
              value={formData.recordedAt}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading || !formData.foodId}>
          {loading ? '記錄中...' : '記錄飲食'}
        </button>
      </form>
    </div>
  );
};
