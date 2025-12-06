const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const SocialLink = require('../models/SocialLink');

// Obter página pública da loja
exports.getPublicPage = async (req, res) => {
  try {
    const { slug } = req.params;

    // Buscar usuário pelo slug
    const user = await User.findBySlug(slug);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Loja não encontrada'
      });
    }

    // Verificar se a assinatura está ativa
    const now = new Date();
    const isActive =
      user.subscription_status === 'active' ||
      (user.subscription_status === 'trial' && new Date(user.trial_end_date) > now);

    if (!isActive) {
      return res.status(403).json({
        success: false,
        message: 'Esta loja está temporariamente indisponível'
      });
    }

    // Buscar informações da loja
    const store = await Store.findByUserId(user.id);

    // Buscar produtos disponíveis
    const products = await Product.findByUserId(user.id, {
      isAvailable: true
    });

    // Buscar produtos em destaque
    const featured = await Product.getFeatured(user.id);

    // Buscar links sociais ativos
    const socialLinks = await SocialLink.findActiveByUserId(user.id);

    res.json({
      success: true,
      data: {
        slug: user.store_slug,
        store,
        products,
        featured,
        socialLinks
      }
    });
  } catch (error) {
    console.error('Erro ao buscar página pública:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar página'
    });
  }
};

// Registrar visualização de produto
exports.trackProductView = async (req, res) => {
  try {
    const { productId } = req.params;
    await Product.incrementViews(productId);

    res.json({
      success: true
    });
  } catch (error) {
    console.error('Erro ao registrar visualização:', error);
    res.status(500).json({
      success: false
    });
  }
};

// Registrar clique no WhatsApp
exports.trackWhatsappClick = async (req, res) => {
  try {
    const { productId } = req.params;
    await Product.incrementWhatsappClicks(productId);

    res.json({
      success: true
    });
  } catch (error) {
    console.error('Erro ao registrar clique:', error);
    res.status(500).json({
      success: false
    });
  }
};

// Registrar clique em rede social
exports.trackSocialClick = async (req, res) => {
  try {
    const { slug, platform } = req.params;

    const user = await User.findBySlug(slug);
    if (user) {
      await SocialLink.incrementClicks(user.id, platform);
    }

    res.json({
      success: true
    });
  } catch (error) {
    console.error('Erro ao registrar clique social:', error);
    res.status(500).json({
      success: false
    });
  }
};
