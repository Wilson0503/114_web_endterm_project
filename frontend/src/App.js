import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { FoodProvider } from './context/FoodContext';
import { Login, Register } from './components/Auth';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

function App() {
  const { token, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>載入中...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <>
        {authMode === 'login' ? (
          <Login onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </>
    );
  }

  return (
    <FoodProvider>
      <Dashboard />
    </FoodProvider>
  );
}

export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
