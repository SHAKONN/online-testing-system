const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { auth, adminAuth } = require('../middleware/auth');

// Публичные маршруты (только чтение для информации)
router.get('/', auth, questionController.getAllQuestions);
router.get('/category/:category', auth, questionController.getQuestionsByCategory);

// Защищенные маршруты (admin)
router.post('/', auth, adminAuth, questionController.createQuestion);
router.put('/:questionId', auth, adminAuth, questionController.updateQuestion);
router.delete('/:questionId', auth, adminAuth, questionController.deleteQuestion);

module.exports = router;
