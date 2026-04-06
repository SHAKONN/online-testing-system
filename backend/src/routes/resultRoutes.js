const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { auth, adminAuth } = require('../middleware/auth');

// Защищенные маршруты
router.post('/submit', auth, resultController.submitTest);
router.get('/my-results', auth, resultController.getUserResults);
router.get('/:resultId', auth, resultController.getResultById);
router.get('/leaderboard/top', resultController.getLeaderboard);

// Admin маршруты
router.get('/stats/admin', auth, adminAuth, resultController.getStatistics);

module.exports = router;
