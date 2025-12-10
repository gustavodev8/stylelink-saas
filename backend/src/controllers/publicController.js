// ===================================
// PUBLIC CONTROLLER
// ===================================

const pool = require('../config/database');

// Buscar loja pública por slug
exports.getStoreBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Buscar usuário/loja pelo slug
    const userResult = await pool.query(
      'SELECT id, email, store_slug, created_at FROM users WHERE store_slug = $1',
      [slug]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Loja não encontrada'
      });
    }

    const user = userResult.rows[0];
    const userId = user.id;

    // Buscar informações da loja
    const storeResult = await pool.query(
      'SELECT name, bio, description, logo, banner, theme_color, whatsapp FROM stores WHERE user_id = $1',
      [userId]
    );

    const store = storeResult.rows[0] || {
      name: slug,
      bio: 'Bem-vindo ao meu link in bio!',
      description: null,
      logo: null,
      banner: null,
      theme_color: '#6366f1',
      whatsapp: null
    };

    // Buscar produtos ativos
    const productsResult = await pool.query(
      `SELECT id, name, description, price, images, image_url, is_active, views, colors, sizes
       FROM products
       WHERE user_id = $1 AND is_active = true
       ORDER BY created_at DESC`,
      [userId]
    );

    // Buscar links de redes sociais ativos
    const socialResult = await pool.query(
      `SELECT platform, url, is_active
       FROM social_links
       WHERE user_id = $1 AND is_active = true
       ORDER BY created_at ASC`,
      [userId]
    );

    // Retornar dados completos da loja
    res.json({
      success: true,
      data: {
        store: {
          slug,
          name: store.name,
          bio: store.bio,
          description: store.description,
          avatar: store.logo,
          banner: store.banner,
          themeColor: store.theme_color,
          whatsapp: store.whatsapp
        },
        products: productsResult.rows.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          images: product.images || (product.image_url ? [product.image_url] : []),
          image_url: product.image_url,
          is_active: product.is_active,
          views: product.views || 0,
          colors: product.colors,
          sizes: product.sizes
        })),
        socialLinks: socialResult.rows
      }
    });
  } catch (error) {
    console.error('Erro ao buscar loja pública:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar loja'
    });
  }
};

// Registrar view de produto (analytics)
exports.trackProductView = async (req, res) => {
  try {
    const { productId } = req.params;

    // Incrementar views do produto
    await pool.query(
      'UPDATE products SET views = COALESCE(views, 0) + 1 WHERE id = $1',
      [productId]
    );

    res.json({
      success: true,
      message: 'View registrada'
    });
  } catch (error) {
    console.error('Erro ao registrar view:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar view'
    });
  }
};

// Registrar clique no link da loja (analytics)
exports.trackStoreClick = async (req, res) => {
  try {
    const { slug } = req.params;

    // Buscar usuário pelo slug
    const userResult = await pool.query(
      'SELECT id FROM users WHERE store_slug = $1',
      [slug]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Loja não encontrada'
      });
    }

    // Aqui você pode criar uma tabela de analytics para registrar cliques
    // Por enquanto, vamos apenas retornar sucesso
    res.json({
      success: true,
      message: 'Clique registrado'
    });
  } catch (error) {
    console.error('Erro ao registrar clique:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar clique'
    });
  }
};
