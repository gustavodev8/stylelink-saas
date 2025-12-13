// ===================================
// STYLELINK SAAS - SERVIDOR
// ===================================

require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');
const { runMigrations } = require('./database/migrate');

const PORT = process.env.PORT || 3000;

// Função para iniciar o servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco
    console.log('🔄 Testando conexão com o banco de dados...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('❌ Não foi possível conectar ao banco de dados');
      process.exit(1);
    }

    // Executar migrações
    await runMigrations();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════╗');
      console.log('║                                          ║');
      console.log('║      🚀 STYLELINK API RODANDO! 🚀       ║');
      console.log('║                                          ║');
      console.log('╚══════════════════════════════════════════╝');
      console.log('');
      console.log(`📡 Servidor: http://localhost:${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}`);
      console.log('');
      console.log('✅ Sistema pronto para receber requisições!');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM recebido, encerrando graciosamente...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('⚠️  SIGINT recebido, encerrando graciosamente...');
  process.exit(0);
});

// Iniciar servidor
startServer();
