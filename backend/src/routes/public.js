// ===================================
// PUBLIC ROUTES
// ===================================

const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Buscar loja pública por slug
router.get('/store/:slug', publicController.getStoreBySlug);

// Registrar view de produto (analytics)
router.post('/track/product/:productId', publicController.trackProductView);

// Registrar clique no link da loja (analytics)
router.post('/track/click/:slug', publicController.trackStoreClick);

module.exports = router;
