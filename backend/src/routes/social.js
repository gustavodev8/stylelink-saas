const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const auth = require('../middleware/auth');
const { validateSocialLink, validate } = require('../middleware/validator');

// Todas as rotas requerem autenticação
router.use(auth);

router.get('/', socialController.getAllSocialLinks);
router.post('/', validateSocialLink, validate, socialController.upsertSocialLink);
router.delete('/:platform', socialController.deleteSocialLink);

module.exports = router;
