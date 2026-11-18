const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { requirePrimaryAdmin } = require('../middlewares/authMiddleware');
const { listUsers, updateUserRole } = require('../controllers/userController');

const router = express.Router();

router.use(authMiddleware);
router.use(requirePrimaryAdmin);

router.get('/', listUsers);
router.patch('/:id/role', updateUserRole);

module.exports = router;
