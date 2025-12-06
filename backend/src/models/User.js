const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Criar novo usuário
  static async create({ email, password, storeSlug }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 dias de trial

    const query = `
      INSERT INTO users (email, password_hash, store_slug, subscription_status, trial_end_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, store_slug, subscription_status, trial_end_date, created_at
    `;

    const result = await pool.query(query, [
      email,
      passwordHash,
      storeSlug,
      'trial',
      trialEndDate
    ]);

    return result.rows[0];
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Buscar usuário por ID
  static async findById(id) {
    const query = 'SELECT id, email, store_slug, subscription_status, subscription_end_date, trial_end_date, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Buscar usuário por slug
  static async findBySlug(slug) {
    const query = 'SELECT id, email, store_slug, subscription_status FROM users WHERE store_slug = $1';
    const result = await pool.query(query, [slug]);
    return result.rows[0];
  }

  // Verificar senha
  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Atualizar último login
  static async updateLastLogin(id) {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Atualizar status de assinatura
  static async updateSubscription(id, status, endDate) {
    const query = `
      UPDATE users
      SET subscription_status = $1, subscription_end_date = $2
      WHERE id = $3
      RETURNING id, subscription_status, subscription_end_date
    `;
    const result = await pool.query(query, [status, endDate, id]);
    return result.rows[0];
  }

  // Verificar se slug está disponível
  static async isSlugAvailable(slug) {
    const query = 'SELECT id FROM users WHERE store_slug = $1';
    const result = await pool.query(query, [slug]);
    return result.rows.length === 0;
  }
}

module.exports = User;
