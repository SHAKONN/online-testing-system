const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Регистрация и логин (без auth)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Получить профиль (требует auth)
router.get('/profile', auth, authController.getProfile);

module.exports = router;
