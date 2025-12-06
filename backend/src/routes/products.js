const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const { validateProduct, validate } = require('../middleware/validator');

// Todas as rotas requerem autenticação
router.use(auth);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.post('/', validateProduct, validate, productController.createProduct);
router.put('/:id', validateProduct, validate, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
