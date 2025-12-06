const { pool } = require('../config/database');

class SocialLink {
  // Criar ou atualizar link social
  static async upsert(userId, platform, data) {
    const { url, username = null, isActive = true } = data;

    const query = `
      INSERT INTO social_links (user_id, platform, url, username, is_active)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, platform)
      DO UPDATE SET
        url = EXCLUDED.url,
        username = EXCLUDED.username,
        is_active = EXCLUDED.is_active,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await pool.query(query, [userId, platform, url, username, isActive]);
    return result.rows[0];
  }

  // Buscar todos os links do usuário
  static async findByUserId(userId) {
    const query = `
      SELECT * FROM social_links
      WHERE user_id = $1
      ORDER BY platform ASC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Buscar apenas links ativos
  static async findActiveByUserId(userId) {
    const query = `
      SELECT * FROM social_links
      WHERE user_id = $1 AND is_active = true
      ORDER BY platform ASC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Deletar link
  static async delete(userId, platform) {
    const query = 'DELETE FROM social_links WHERE user_id = $1 AND platform = $2';
    const result = await pool.query(query, [userId, platform]);
    return result.rowCount > 0;
  }

  // Incrementar cliques
  static async incrementClicks(userId, platform) {
    const query = `
      UPDATE social_links
      SET clicks_count = clicks_count + 1
      WHERE user_id = $1 AND platform = $2
    `;
    await pool.query(query, [userId, platform]);
  }
}

module.exports = SocialLink;
