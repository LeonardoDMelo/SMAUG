const express = require('express');
const { getTodayQuiz, submitQuiz, resetQuiz } = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/today', getTodayQuiz);
router.post('/submit', submitQuiz);
router.post('/reset', resetQuiz);

module.exports = router;
