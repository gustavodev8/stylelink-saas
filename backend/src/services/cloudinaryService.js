const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Upload de uma imagem
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'stylelink',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Upload de múltiplas imagens
const uploadMultipleToCloudinary = async (buffers, options = {}) => {
  const uploadPromises = buffers.map(buffer =>
    uploadToCloudinary(buffer, options)
  );

  return Promise.all(uploadPromises);
};

// Deletar imagem do Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary
};
