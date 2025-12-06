const { body, validationResult } = require('express-validator');

// Middleware para processar erros de validação
exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  next();
};

// Validações para registro
exports.validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('storeName')
    .notEmpty()
    .withMessage('Nome da loja é obrigatório')
    .trim(),
  body('storeSlug')
    .notEmpty()
    .withMessage('Link da loja é obrigatório')
    .isLength({ min: 3, max: 50 })
    .withMessage('Link deve ter entre 3 e 50 caracteres')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Link deve conter apenas letras minúsculas, números e hífens')
    .trim()
];

// Validações para login
exports.validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

// Validações para produto
exports.validateProduct = [
  body('name')
    .notEmpty()
    .withMessage('Nome do produto é obrigatório')
    .trim(),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número válido maior que zero'),
  body('description')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim(),
  body('images')
    .optional()
    .isArray()
    .withMessage('Imagens deve ser um array'),
  body('sizes')
    .optional()
    .isArray()
    .withMessage('Tamanhos deve ser um array'),
  body('colors')
    .optional()
    .isArray()
    .withMessage('Cores deve ser um array')
];

// Validações para loja
exports.validateStore = [
  body('storeName')
    .optional()
    .notEmpty()
    .withMessage('Nome da loja não pode ser vazio')
    .trim(),
  body('bio')
    .optional()
    .trim(),
  body('phone')
    .optional()
    .matches(/^\+?[0-9\s\-\(\)]+$/)
    .withMessage('Telefone inválido'),
  body('whatsapp')
    .optional()
    .matches(/^\+?[0-9\s\-\(\)]+$/)
    .withMessage('WhatsApp inválido'),
  body('primaryColor')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Cor primária deve ser um código hexadecimal válido'),
  body('secondaryColor')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Cor secundária deve ser um código hexadecimal válido'),
  body('templateId')
    .optional()
    .isInt({ min: 1, max: 2 })
    .withMessage('Template inválido')
];

// Validações para link social
exports.validateSocialLink = [
  body('platform')
    .notEmpty()
    .withMessage('Plataforma é obrigatória')
    .isIn(['instagram', 'facebook', 'tiktok', 'youtube', 'pinterest', 'twitter', 'whatsapp'])
    .withMessage('Plataforma inválida'),
  body('url')
    .notEmpty()
    .withMessage('URL é obrigatória')
    .isURL()
    .withMessage('URL inválida'),
  body('username')
    .optional()
    .trim()
];
