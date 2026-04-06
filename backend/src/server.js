require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/database');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const questionRoutes = require('./routes/questionRoutes');
const resultRoutes = require('./routes/resultRoutes');

// Инициализация Express
const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Сервер работает' });
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error('Ошибка:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Внутренняя ошибка сервера',
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// ===== DATABASE CONNECTION & SERVER START =====
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Сервер запущен на порту ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Не удалось запустить сервер:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
