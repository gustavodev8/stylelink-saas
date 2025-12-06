const SocialLink = require('../models/SocialLink');

// Listar todos os links sociais
exports.getAllSocialLinks = async (req, res) => {
  try {
    const links = await SocialLink.findByUserId(req.userId);

    res.json({
      success: true,
      data: links
    });
  } catch (error) {
    console.error('Erro ao buscar links sociais:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar links sociais'
    });
  }
};

// Criar ou atualizar link social
exports.upsertSocialLink = async (req, res) => {
  try {
    const { platform, url, username, isActive } = req.body;

    const validPlatforms = ['instagram', 'facebook', 'tiktok', 'youtube', 'pinterest', 'twitter', 'whatsapp'];

    if (!platform || !validPlatforms.includes(platform)) {
      return res.status(400).json({
        success: false,
        message: 'Plataforma inválida'
      });
    }

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL é obrigatória'
      });
    }

    const link = await SocialLink.upsert(req.userId, platform, {
      url,
      username,
      isActive
    });

    res.json({
      success: true,
      message: 'Link social atualizado com sucesso!',
      data: link
    });
  } catch (error) {
    console.error('Erro ao salvar link social:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao salvar link social'
    });
  }
};

// Deletar link social
exports.deleteSocialLink = async (req, res) => {
  try {
    const { platform } = req.params;
    const deleted = await SocialLink.delete(req.userId, platform);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Link não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Link deletado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao deletar link social:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar link social'
    });
  }
};
