const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin, validate } = require('../middleware/validator');
const auth = require('../middleware/auth');

// Rotas públicas
router.post('/register', validateRegister, validate, authController.register);
router.post('/login', validateLogin, validate, authController.login);
router.post('/verify-email', authController.verifyEmailCode);
router.post('/resend-code', authController.resendVerificationCode);
router.get('/check-slug/:slug', authController.checkSlug);

// Rotas protegidas
router.get('/profile', auth, authController.getProfile);

module.exports = router;
