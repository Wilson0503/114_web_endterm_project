import React, { useState, useEffect } from 'react';
import { recordApi } from '../services/api';
import { format } from 'date-fns';
import '../styles/RecordList.css';

export const RecordList = ({ refreshTrigger }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchRecords();
  }, [selectedDate, refreshTrigger]);

  const fetchRecords = async () => {
    setLoading(true);
    setError('');

    try {
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);

      const res = await recordApi.getUserRecords({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      setRecords(res.data.data);
    } catch (err) {
      setError('獲取記錄失敗');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('確定要刪除此記錄嗎？')) {
      try {
        await recordApi.deleteRecord(recordId);
        setRecords(records.filter(r => r._id !== recordId));
      } catch (err) {
        setError('刪除記錄失敗');
      }
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setEditData({
      quantity: record.quantity,
      mealType: record.mealType
    });
  };

  const handleSaveEdit = async (recordId) => {
    try {
      await recordApi.updateRecord(recordId, editData);
      await fetchRecords();
      setEditingId(null);
    } catch (err) {
      setError('更新記錄失敗');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const mealTypeLabels = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '點心'
  };

  const totalCalories = records.reduce((sum, r) => sum + r.totalCalories, 0);
  const groupedByMealType = records.reduce((acc, record) => {
    const type = record.mealType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(record);
    return acc;
  }, {});

  return (
    <div className="record-list">
      <div className="list-header">
        <h2><img src="/notes.png" alt="飲食記錄" style={{ height: '28px', marginRight: '10px', verticalAlign: 'middle' }} />飲食記錄</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-picker"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="daily-stats">
        <div className="stat-card">
          <div className="stat-label">今日總卡路里</div>
          <div className="stat-value">{totalCalories} kcal</div>
        </div>
      </div>

      {loading && <p className="loading">載入中...</p>}

      {!loading && records.length === 0 && (
        <p className="empty-message">此日期沒有記錄</p>
      )}

      {!loading && records.length > 0 && (
        <div className="records-by-meal">
          {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
            const mealRecords = groupedByMealType[mealType] || [];
            if (mealRecords.length === 0) return null;

            const mealTotal = mealRecords.reduce((sum, r) => sum + r.totalCalories, 0);

            return (
              <div key={mealType} className="meal-section">
                <h3 className="meal-title">
                  {mealTypeLabels[mealType]} ({mealTotal} kcal)
                </h3>
                <div className="meal-records">
                  {mealRecords.map(record => (
                    <div key={record._id} className="record-item">
                      {editingId === record._id ? (
                        <div className="record-edit-form">
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={editData.quantity}
                            onChange={(e) => setEditData({...editData, quantity: parseFloat(e.target.value)})}
                          />
                          <select
                            value={editData.mealType}
                            onChange={(e) => setEditData({...editData, mealType: e.target.value})}
                          >
                            <option value="breakfast">早餐</option>
                            <option value="lunch">午餐</option>
                            <option value="dinner">晚餐</option>
                            <option value="snack">點心</option>
                          </select>
                          <button onClick={() => handleSaveEdit(record._id)} className="btn btn-sm btn-success">保存</button>
                          <button onClick={handleCancelEdit} className="btn btn-sm btn-secondary">取消</button>
                        </div>
                      ) : (
                        <>
                          <div className="record-details">
                            <div className="record-name">{record.foodId.name}</div>
                            <div className="record-info">
                              {record.quantity} × {record.foodId.calories} kcal = {record.totalCalories} kcal
                            </div>
                          </div>
                          <div className="record-actions">
                            <button
                              onClick={() => handleEdit(record)}
                              className="btn btn-sm btn-edit"
                            >
                              編輯
                            </button>
                            <button
                              onClick={() => handleDelete(record._id)}
                              className="btn btn-sm btn-delete"
                            >
                              刪除
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
