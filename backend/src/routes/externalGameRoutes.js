const express = require('express');
const { search, getById } = require('../controllers/externalGameController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/games/search', search);
router.get('/games/:id', getById);

module.exports = router;
