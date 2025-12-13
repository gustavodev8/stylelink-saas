// ===================================
// STYLELINK SAAS - CONFIGURAÇÃO EXPRESS
// ===================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// ===================================
// CONFIGURAÇÕES
// ===================================

// Trust proxy (necessário para Railway e outros serviços de hospedagem)
app.set('trust proxy', 1);

// ===================================
// MIDDLEWARES GLOBAIS
// ===================================

// Segurança com Helmet (configurado para permitir recursos estáticos)
app.use(helmet({
  contentSecurityPolicy: false, // Desabilita CSP para permitir inline scripts
  crossOriginEmbedderPolicy: false
}));

// CORS - permitir requisições do mesmo domínio e localhost
app.use(cors({
  origin: function(origin, callback) {
    // Permitir requisições sem origin (mobile apps, postman, etc)
    if (!origin) return callback(null, true);

    // Lista de origens permitidas
    const allowedOrigins = [
      process.env.FRONTEND_ADMIN_URL,
      process.env.FRONTEND_PUBLIC_URL,
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:8081',
      origin // Permitir a própria origem (quando frontend está no mesmo domínio)
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('railway.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Permitir todas por enquanto
    }
  },
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

// Logging de todas as requisições (produção e desenvolvimento)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ===================================
// ROTAS
// ===================================

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Rota de teste do banco de dados
app.get('/api/test/db', async (req, res) => {
  try {
    const pool = require('./config/database');
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    res.json({
      success: true,
      database: 'connected',
      currentTime: result.rows[0].current_time,
      postgresVersion: result.rows[0].pg_version,
      env: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: 'error',
      error: error.message
    });
  }
});

// Importar rotas
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const storeRoutes = require('./routes/store');
const socialRoutes = require('./routes/social');
const pageRoutes = require('./routes/page');
const uploadRoutes = require('./routes/upload');
const publicRoutes = require('./routes/public');

// Usar rotas da API (IMPORTANTE: Antes do express.static)
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/page', pageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/public', publicRoutes);

// ===================================
// SERVIR ARQUIVOS ESTÁTICOS (FRONTEND)
// ===================================

// IMPORTANTE: Servir arquivos estáticos DEPOIS das rotas da API
// para não interferir com as requisições para /api/*
const frontendPath = path.join(__dirname, '../../frontend');

// Rota raiz redireciona para admin
app.get('/', (req, res) => {
  res.redirect('/admin/index.html');
});

// Rota para a página pública (Link in Bio)
app.get('/public', (req, res) => {
  res.sendFile(path.join(frontendPath, 'public', 'index.html'));
});

// Servir arquivos estáticos do frontend
app.use(express.static(frontendPath));

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
