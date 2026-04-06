import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Создаём instance axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем token в каждый запрос
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== AUTH ENDPOINTS =====
export const authService = {
  register: (name, email, password, confirmPassword) =>
    api.post('/auth/register', { name, email, password, confirmPassword }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  getProfile: () =>
    api.get('/auth/profile'),
};

// ===== TEST ENDPOINTS =====
export const testService = {
  getAllTests: () =>
    api.get('/tests'),
  
  getTestsByCategory: (category) =>
    api.get(`/tests/category/${category}`),
  
  getTestWithQuestions: (testId) =>
    api.get(`/tests/${testId}/questions`),
  
  createTest: (testData) =>
    api.post('/tests', testData),
  
  updateTest: (testId, testData) =>
    api.put(`/tests/${testId}`, testData),
  
  deleteTest: (testId) =>
    api.delete(`/tests/${testId}`),
};

// ===== QUESTION ENDPOINTS =====
export const questionService = {
  getAllQuestions: () =>
    api.get('/questions'),
  
  getQuestionsByCategory: (category) =>
    api.get(`/questions/category/${category}`),
  
  createQuestion: (questionData) =>
    api.post('/questions', questionData),
  
  updateQuestion: (questionId, questionData) =>
    api.put(`/questions/${questionId}`, questionData),
  
  deleteQuestion: (questionId) =>
    api.delete(`/questions/${questionId}`),
};

// ===== RESULT ENDPOINTS =====
export const resultService = {
  submitTest: (testId, answers, timeSpent) =>
    api.post('/results/submit', { testId, answers, timeSpent }),
  
  getUserResults: () =>
    api.get('/results/my-results'),
  
  getResultById: (resultId) =>
    api.get(`/results/${resultId}`),
  
  getLeaderboard: () =>
    api.get('/results/leaderboard/top'),
  
  getStatistics: () =>
    api.get('/results/stats/admin'),
};

export default api;
