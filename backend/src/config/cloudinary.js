// ===================================
// STYLELINK SAAS - CONFIGURAÇÃO CLOUDINARY
// ===================================

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Função para fazer upload de imagem
const uploadImage = async (file, folder = 'stylelink') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('❌ Erro no upload Cloudinary:', error);
    throw new Error('Falha no upload da imagem');
  }
};

// Função para deletar imagem
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('❌ Erro ao deletar imagem:', error);
    throw new Error('Falha ao deletar imagem');
  }
};

// Função para upload múltiplo
const uploadMultipleImages = async (files, folder = 'stylelink') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('❌ Erro no upload múltiplo:', error);
    throw new Error('Falha no upload múltiplo de imagens');
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  uploadMultipleImages
};
