// Script para limpar todos os produtos do banco de dados
const { pool } = require('./src/config/database');

async function clearProducts() {
  try {
    console.log('🗑️  Limpando produtos do banco de dados...');

    const result = await pool.query('DELETE FROM products');

    console.log(`✅ ${result.rowCount} produtos foram removidos com sucesso!`);
    console.log('📦 Banco de dados está limpo e pronto para novos produtos.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao limpar produtos:', error);
    process.exit(1);
  }
}

clearProducts();
