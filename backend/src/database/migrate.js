const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function runMigrations() {
  console.log('🔄 Verificando migrações do banco de dados...');

  try {
    // Ler arquivo de migração
    const migration1 = fs.readFileSync(
      path.join(__dirname, 'migrations', '001_schema_completo.sql'),
      'utf8'
    );

    const migration2 = fs.readFileSync(
      path.join(__dirname, 'migrations', '002_add_email_verification.sql'),
      'utf8'
    );

    // Verificar se tabela users já existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'users'
      );
    `);

    const tablesExist = tableCheck.rows[0].exists;

    if (!tablesExist) {
      console.log('📋 Criando tabelas do banco de dados...');

      // Executar migração 1
      await pool.query(migration1);
      console.log('✅ Schema completo criado!');

      // Executar migração 2
      await pool.query(migration2);
      console.log('✅ Campos de verificação de email adicionados!');

      console.log('🎉 Banco de dados configurado com sucesso!');
    } else {
      console.log('✅ Tabelas já existem, pulando migrações.');
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    throw error;
  }
}

module.exports = { runMigrations };
