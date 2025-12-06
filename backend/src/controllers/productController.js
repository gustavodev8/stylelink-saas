const Product = require('../models/Product');

// Listar todos os produtos
exports.getAllProducts = async (req, res) => {
  try {
    const { category, isAvailable, isFeatured } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (isAvailable !== undefined) filters.isAvailable = isAvailable === 'true';
    if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';

    const products = await Product.findByUserId(req.userId, filters);

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos'
    });
  }
};

// Buscar produto por ID
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id, req.userId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produto'
    });
  }
};

// Criar novo produto
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, sizes, colors, isAvailable, isFeatured } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Nome e preço são obrigatórios'
      });
    }

    const product = await Product.create(req.userId, {
      name,
      description,
      price,
      category,
      images,
      sizes,
      colors,
      isAvailable,
      isFeatured
    });

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso!',
      data: product
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar produto'
    });
  }
};

// Atualizar produto
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = [
      'name',
      'description',
      'price',
      'category',
      'images',
      'sizes',
      'colors',
      'isAvailable',
      'isFeatured'
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

    const product = await Product.update(id, req.userId, updateData);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso!',
      data: product
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar produto'
    });
  }
};

// Deletar produto
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.delete(id, req.userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Produto deletado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar produto'
    });
  }
};
