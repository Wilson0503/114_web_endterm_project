import React, { useState, useEffect } from 'react';
import { foodApi } from '../services/api';
import '../styles/FoodManager.css';

export const FoodManager = ({ onFoodAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: '',
    servingSize: '100克'
  });

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await foodApi.getAllFoods();
      setFoods(res.data.data);
    } catch (err) {
      setError('獲取食物清單失敗');
    } finally {
      setLoading(false);
    }
  };
  // [新增] 監聽營養素變化，自動計算卡路里
  useEffect(() => {
    const p = parseFloat(formData.protein) || 0;
    const c = parseFloat(formData.carbohydrates) || 0; // [修改] 使用 carbohydrates
    const f = parseFloat(formData.fat) || 0;

    // 只有當有輸入任一營養素時才自動計算
    if (p > 0 || c > 0 || f > 0) {
      const calculatedCalories = Math.round((p * 4) + (c * 4) + (f * 9));
      setFormData(prev => ({
        ...prev,
        calories: calculatedCalories
      }));
    }
  }, [formData.protein, formData.carbohydrates, formData.fat]); // 監聽這三個變數
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['calories', 'protein', 'carbohydrates', 'fat'].includes(name) ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.calories) {
      setError('請填寫食物名稱和卡路里');
      return;
    }

    try {
      if (editingId) {
        await foodApi.updateFood(editingId, formData);
        setEditingId(null);
      } else {
        await foodApi.createFood(formData);
      }

      setFormData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        servingSize: '100克'
      });

      await fetchFoods();
      
      if (onFoodAdded) {
        onFoodAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || '操作失敗');
    }
  };

  const handleEdit = (food) => {
    setEditingId(food._id);
    setFormData({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbohydrates: food.carbs || food.carbohydrates,
      fat: food.fat,
      servingSize: food.servingSize
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbohydrates: '',
      fat: '',
      servingSize: '100克'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除此食物嗎？')) {
      try {
        await foodApi.deleteFood(id);
        await fetchFoods();
      } catch (err) {
        setError('刪除失敗');
      }
    }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="food-manager">
      <div className="food-manager-header">
        <h2><img src="/diet.png" alt="食物管理" style={{ height: '28px', marginRight: '10px', verticalAlign: 'middle' }} />食物管理</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="food-manager-content">
        <div className="food-form-section">
          <h3>{editingId ? '編輯食物' : '新增食物'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">食物名稱 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="calories">卡路里 (kcal) *</label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="輸入營養素可自動計算"  // [新增] 提示文字
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="servingSize">份量</label>
                <input
                  type="text"
                  id="servingSize"
                  name="servingSize"
                  value={formData.servingSize}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="protein">蛋白質 (g)</label>
                <input
                  type="number"
                  id="protein"
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="carbohydrates">碳水化合物 (g)</label>
                <input
                  type="number"
                  id="carbohydrates"
                  name="carbohydrates"
                  value={formData.carbohydrates}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fat">脂肪 (g)</label>
                <input
                  type="number"
                  id="fat"
                  name="fat"
                  value={formData.fat}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? '更新食物' : '新增食物'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  取消
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="food-list-section">
          <h3>食物清單</h3>
          <input
            type="text"
            placeholder="搜尋食物..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          {loading && <p className="loading">載入中...</p>}

          <div className="food-list">
            {filteredFoods.map(food => (
              <div key={food._id} className="food-item">
                <div className="food-info">
                  <div className="food-name">{food.name}</div>
                  <div className="food-nutrition">
                    {food.calories} kcal / {food.servingSize}
                    {food.protein > 0 && ` | 蛋白質: ${food.protein}g`}
                    {food.carbs > 0 && ` | 碳水: ${food.carbs}g`}
                    {food.fat > 0 && ` | 脂肪: ${food.fat}g`}
                  </div>
                  <div className="food-source">
                    來源: {food.source === 'user' ? '用戶自訂' : food.source === 'tfda' ? 'TFDA' : 'Open Food Facts'}
                  </div>
                </div>
                <div className="food-actions">
                  <button onClick={() => handleEdit(food)} className="btn btn-sm btn-edit">
                    編輯
                  </button>
                  <button onClick={() => handleDelete(food._id)} className="btn btn-sm btn-delete">
                    刪除
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!loading && filteredFoods.length === 0 && (
            <p className="empty-message">沒有找到食物</p>
          )}
        </div>
      </div>
    </div>
  );
};
