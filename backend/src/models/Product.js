const { pool } = require('../config/database');

class Product {
  // Criar novo produto
  static async create(userId, data) {
    const {
      name,
      description = null,
      price,
      category = null,
      images = [],
      sizes = [],
      colors = [],
      isAvailable = true,
      isFeatured = false
    } = data;

    const query = `
      INSERT INTO products (
        user_id, name, description, price, category,
        images, sizes, colors, is_available, is_featured
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId, name, description, price, category,
      JSON.stringify(images), JSON.stringify(sizes), JSON.stringify(colors),
      isAvailable, isFeatured
    ]);

    return result.rows[0];
  }

  // Buscar todos os produtos do usuário
  static async findByUserId(userId, filters = {}) {
    let query = 'SELECT * FROM products WHERE user_id = $1';
    const values = [userId];
    let paramCount = 2;

    if (filters.category) {
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.isAvailable !== undefined) {
      query += ` AND is_available = $${paramCount}`;
      values.push(filters.isAvailable);
      paramCount++;
    }

    if (filters.isFeatured !== undefined) {
      query += ` AND is_featured = $${paramCount}`;
      values.push(filters.isFeatured);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Buscar produto por ID
  static async findById(id, userId) {
    const query = 'SELECT * FROM products WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  // Atualizar produto
  static async update(id, userId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();

        // Se for array, converter para JSON
        if (Array.isArray(data[key])) {
          fields.push(`${dbKey} = $${paramCount}`);
          values.push(JSON.stringify(data[key]));
        } else {
          fields.push(`${dbKey} = $${paramCount}`);
          values.push(data[key]);
        }
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('Nenhum campo para atualizar');
    }

    values.push(id, userId);
    const query = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Deletar produto
  static async delete(id, userId) {
    const query = 'DELETE FROM products WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return result.rowCount > 0;
  }

  // Incrementar visualizações
  static async incrementViews(id) {
    const query = 'UPDATE products SET views_count = views_count + 1 WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Incrementar cliques no WhatsApp
  static async incrementWhatsappClicks(id) {
    const query = 'UPDATE products SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Buscar produtos em destaque
  static async getFeatured(userId) {
    const query = `
      SELECT * FROM products
      WHERE user_id = $1 AND is_featured = true AND is_available = true
      ORDER BY created_at DESC
      LIMIT 6
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = Product;
