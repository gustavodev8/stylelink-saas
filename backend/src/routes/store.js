const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const auth = require('../middleware/auth');
const { validateStore, validate } = require('../middleware/validator');

// Todas as rotas requerem autenticação
router.use(auth);

router.get('/', storeController.getStore);
router.put('/', validateStore, validate, storeController.updateStore);

module.exports = router;
