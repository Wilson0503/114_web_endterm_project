import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// 添加請求攔截器以附加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 用戶相關 API
export const userApi = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getCurrentUser: () => api.get('/users/me'),
  updateUser: (data) => api.put('/users/me', data),
  getUserStats: () => api.get('/users/stats')
};

// 食物相關 API
export const foodApi = {
  getAllFoods: (params) => api.get('/foods', { params }),
  getFoodById: (id) => api.get(`/foods/${id}`),
  createFood: (data) => api.post('/foods', data),
  updateFood: (id, data) => api.put(`/foods/${id}`, data),
  deleteFood: (id) => api.delete(`/foods/${id}`),
  searchByName: (name) => api.get('/foods/search/name', { params: { name } }),
  searchByBarcode: (barcode) => api.get(`/foods/search/barcode/${barcode}`)
};

// 記錄相關 API
export const recordApi = {
  createRecord: (data) => api.post('/records', data),
  getUserRecords: (params) => api.get('/records', { params }),
  getRecordById: (id) => api.get(`/records/${id}`),
  updateRecord: (id, data) => api.put(`/records/${id}`, data),
  deleteRecord: (id) => api.delete(`/records/${id}`),
  getDayStats: (date) => api.get('/records/stats/day', { params: { date } })
};

export default api;
