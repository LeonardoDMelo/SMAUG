const express = require('express');
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', gameController.create);
router.get('/', gameController.list);
router.get('/:id', gameController.getById);
router.put('/:id', gameController.update);
router.delete('/:id', gameController.delete);

module.exports = router;
