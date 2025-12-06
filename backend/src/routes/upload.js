const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadSingle, uploadMultiple, handleUploadError } = require('../middleware/upload');
const { uploadToCloudinary, uploadMultipleToCloudinary } = require('../services/cloudinaryService');

// Upload de uma imagem
router.post('/single', auth, uploadSingle, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo enviado'
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: `stylelink/${req.userId}`
    });

    res.json({
      success: true,
      message: 'Upload realizado com sucesso!',
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer upload da imagem'
    });
  }
});

// Upload de múltiplas imagens
router.post('/multiple', auth, uploadMultiple, handleUploadError, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo enviado'
      });
    }

    const results = await uploadMultipleToCloudinary(
      req.files.map(file => file.buffer),
      { folder: `stylelink/${req.userId}` }
    );

    res.json({
      success: true,
      message: 'Upload realizado com sucesso!',
      data: results.map(result => ({
        url: result.secure_url,
        publicId: result.public_id
      }))
    });
  } catch (error) {
    console.error('Erro no upload múltiplo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer upload das imagens'
    });
  }
});

module.exports = router;
