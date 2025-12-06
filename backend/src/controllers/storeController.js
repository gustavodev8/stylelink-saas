const Store = require('../models/Store');

// Obter informações da loja
exports.getStore = async (req, res) => {
  try {
    const store = await Store.findByUserId(req.userId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Loja não encontrada'
      });
    }

    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Erro ao buscar loja:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar informações da loja'
    });
  }
};

// Atualizar informações da loja
exports.updateStore = async (req, res) => {
  try {
    const allowedFields = [
      'storeName',
      'bio',
      'logoUrl',
      'bannerUrl',
      'phone',
      'whatsapp',
      'address',
      'primaryColor',
      'secondaryColor',
      'templateId'
    ];

    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum campo válido para atualizar'
      });
    }

    const updatedStore = await Store.update(req.userId, updateData);

    res.json({
      success: true,
      message: 'Loja atualizada com sucesso!',
      data: updatedStore
    });
  } catch (error) {
    console.error('Erro ao atualizar loja:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar loja'
    });
  }
};
