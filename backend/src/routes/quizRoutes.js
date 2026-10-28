const express = require('express');
const { getTodayQuiz, submitQuiz } = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/today', getTodayQuiz);
router.post('/submit', submitQuiz);

module.exports = router;
