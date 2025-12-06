const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Store = require('../models/Store');

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

    // Gerar token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          storeSlug: user.store_slug
        },
        token
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
