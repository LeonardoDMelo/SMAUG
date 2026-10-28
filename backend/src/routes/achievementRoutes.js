const express = require('express');
const {
  list,
  clearUnlocked,
  grant,
  grantAll,
  revoke,
} = require('../controllers/achievementController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', list);
router.delete('/unlocked', clearUnlocked);
router.post('/grant', grant);
router.post('/grant-all', grantAll);
router.delete('/unlocked/:code', revoke);

module.exports = router;
