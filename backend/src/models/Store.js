const { pool } = require('../config/database');

class Store {
  // Criar nova loja
  static async create(userId, data) {
    const {
      storeName,
      bio = null,
      logoUrl = null,
      bannerUrl = null,
      phone = null,
      whatsapp = null,
      address = null,
      primaryColor = '#6366f1',
      secondaryColor = '#8b5cf6',
      templateId = 1
    } = data;

    const query = `
      INSERT INTO stores (
        user_id, store_name, bio, logo_url, banner_url,
        phone, whatsapp, address, primary_color, secondary_color, template_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId, storeName, bio, logoUrl, bannerUrl,
      phone, whatsapp, address, primaryColor, secondaryColor, templateId
    ]);

    return result.rows[0];
  }

  // Buscar loja por user_id
  static async findByUserId(userId) {
    const query = 'SELECT * FROM stores WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  // Atualizar informações da loja
  static async update(userId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        // Converter camelCase para snake_case
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('Nenhum campo para atualizar');
    }

    values.push(userId);
    const query = `
      UPDATE stores
      SET ${fields.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Deletar loja
  static async delete(userId) {
    const query = 'DELETE FROM stores WHERE user_id = $1';
    await pool.query(query, [userId]);
  }
}

module.exports = Store;
