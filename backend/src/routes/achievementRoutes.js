const express = require('express');
const {
  list,
  clearUnlocked,
  grant,
  grantAll,
  revoke,
} = require('../controllers/achievementController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', list);
router.delete('/unlocked', requireAdmin, clearUnlocked);
router.post('/grant', requireAdmin, grant);
router.post('/grant-all', requireAdmin, grantAll);
router.delete('/unlocked/:code', requireAdmin, revoke);

module.exports = router;
