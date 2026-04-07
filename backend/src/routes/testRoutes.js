const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { auth, adminAuth } = require('../middleware/auth');

// Публичные маршруты
router.get('/', testController.getAllTests);
router.get('/category/:category', testController.getTestsByCategory);
router.get('/:testId/questions', testController.getTestWithQuestions);

// Защищенные маршруты (admin)
router.get('/:testId', auth, adminAuth, testController.getTestById);
router.post('/', auth, adminAuth, testController.createTest);
router.put('/:testId', auth, adminAuth, testController.updateTest);
router.delete('/:testId', auth, adminAuth, testController.deleteTest);

module.exports = router;
