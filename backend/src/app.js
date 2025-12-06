// ===================================
// STYLELINK SAAS - CONFIGURAÇÃO EXPRESS
// ===================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ===================================
// MIDDLEWARES GLOBAIS
// ===================================

// Segurança com Helmet
app.use(helmet());

// CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_ADMIN_URL,
    process.env.FRONTEND_PUBLIC_URL,
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:8081'
  ],
  credentials: true
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting (proteção contra spam)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos'
});
app.use('/api/', limiter);

// Logging básico em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ===================================
// ROTAS
// ===================================

// Rota de health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'StyleLink API está rodando! 🚀',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Importar rotas
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const storeRoutes = require('./routes/store');
const socialRoutes = require('./routes/social');
const pageRoutes = require('./routes/page');
const uploadRoutes = require('./routes/upload');

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/page', pageRoutes);
app.use('/api/upload', uploadRoutes);

// ===================================
// ERROR HANDLERS
// ===================================

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: err.errors
    });
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }

  // Erro genérico
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
