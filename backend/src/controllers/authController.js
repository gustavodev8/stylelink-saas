const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Store = require('../models/Store');
const { sendVerificationCode } = require('../services/emailService');

// Gerar JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Registrar novo usuário
exports.register = async (req, res) => {
  try {
    const { email, password, storeName, storeSlug } = req.body;

    // Validar dados obrigatórios
    if (!email || !password || !storeName || !storeSlug) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, preencha todos os campos obrigatórios'
      });
    }

    // Verificar se email já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está cadastrado'
      });
    }

    // Verificar se slug está disponível
    const slugAvailable = await User.isSlugAvailable(storeSlug);
    if (!slugAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Este link já está em uso. Escolha outro.'
      });
    }

    // Criar usuário
    const user = await User.create({
      email,
      password,
      storeSlug: storeSlug.toLowerCase()
    });

    // Criar loja
    await Store.create(user.id, { storeName });

    // Gerar código de verificação
    const verificationCode = User.generateVerificationCode();
    await User.saveVerificationCode(user.id, verificationCode);

    // Enviar email com código
    try {
      await sendVerificationCode(email, verificationCode, storeName);
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Continua mesmo se o email falhar
    }

    res.status(201).json({
      success: true,
      message: 'Conta criada! Verifique seu email para continuar.',
      data: {
        email: user.email,
        needsVerification: true
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar conta'
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar dados
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, preencha email e senha'
      });
    }

    // Buscar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar senha
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar se o email foi verificado
    if (!user.email_verified) {
      return res.status(403).json({
        success: false,
        message: 'Por favor, verifique seu email antes de fazer login',
        needsVerification: true,
        email: user.email
      });
    }

    // Atualizar último login
    await User.updateLastLogin(user.id);

    // Gerar token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          storeSlug: user.store_slug,
          subscriptionStatus: user.subscription_status
        },
        token
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login'
    });
  }
};

// Obter perfil do usuário autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar perfil'
    });
  }
};

// Verificar disponibilidade de slug
exports.checkSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || slug.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'O link deve ter pelo menos 3 caracteres'
      });
    }

    const available = await User.isSlugAvailable(slug.toLowerCase());

    res.json({
      success: true,
      available
    });
  } catch (error) {
    console.error('Erro ao verificar slug:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar disponibilidade'
    });
  }
};

// Verificar código de email
exports.verifyEmailCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email e código são obrigatórios'
      });
    }

    // Verificar código
    const verification = await User.verifyCode(email, code);

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }

    // Marcar email como verificado
    await User.markEmailVerified(verification.user.id);

    // Gerar token
    const token = generateToken(verification.user.id);

    res.json({
      success: true,
      message: 'Email verificado com sucesso!',
      data: {
        user: {
          id: verification.user.id,
          email: verification.user.email,
          storeSlug: verification.user.store_slug
        },
        token
      }
    });
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar código'
    });
  }
};

// Reenviar código de verificação
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório'
      });
    }

    // Buscar usuário
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email já verificado'
      });
    }

    // Gerar novo código
    const verificationCode = User.generateVerificationCode();
    await User.saveVerificationCode(user.id, verificationCode);

    // Buscar nome da loja
    const Store = require('../models/Store');
    const store = await Store.findByUserId(user.id);

    // Enviar email
    try {
      await sendVerificationCode(email, verificationCode, store?.store_name || 'Usuário');
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Erro ao enviar email. Tente novamente.'
      });
    }

    res.json({
      success: true,
      message: 'Código reenviado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao reenviar código:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao reenviar código'
    });
  }
};
