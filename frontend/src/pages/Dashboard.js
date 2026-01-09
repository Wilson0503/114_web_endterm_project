import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RecordForm } from '../components/RecordForm';
import { RecordList } from '../components/RecordList';
import { FoodManager } from '../components/FoodManager';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('records');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRecordCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFoodAdded = () => {
    // 可選：刷新記錄
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🍎 飲食記錄系統</h1>
          <div className="header-right">
            <span className="user-info">歡迎，{user?.username}！</span>
            <button onClick={logout} className="btn btn-secondary">登出</button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <button
            className={`nav-item ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            📝 飲食記錄
          </button>
          <button
            className={`nav-item ${activeTab === 'manage-foods' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage-foods')}
          >
            🥗 食物管理
          </button>
        </nav>

        <main className="dashboard-content">
          {activeTab === 'records' && (
            <div className="records-section">
              <RecordForm onRecordCreated={handleRecordCreated} />
              <RecordList refreshTrigger={refreshTrigger} />
            </div>
          )}

          {activeTab === 'manage-foods' && (
            <FoodManager onFoodAdded={handleFoodAdded} />
          )}
        </main>
      </div>
    </div>
  );
}
