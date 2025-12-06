const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// Rotas públicas - não requerem autenticação
router.get('/:slug', pageController.getPublicPage);
router.post('/track/product/:productId', pageController.trackProductView);
router.post('/track/whatsapp/:productId', pageController.trackWhatsappClick);
router.post('/track/social/:slug/:platform', pageController.trackSocialClick);

module.exports = router;
