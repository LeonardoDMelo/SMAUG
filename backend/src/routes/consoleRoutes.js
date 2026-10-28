const express = require('express');
const consoleController = require('../controllers/consoleController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', consoleController.create);
router.get('/', consoleController.list);
router.get('/:id', consoleController.getById);
router.put('/:id', consoleController.update);
router.delete('/:id', consoleController.delete);

module.exports = router;
