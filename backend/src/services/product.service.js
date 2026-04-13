const { Product } = require('../models');

async function listProducts() {
  return Product.findAll({ order: [['id', 'ASC']] });
}

async function getProductById(id) {
  const product = await Product.findByPk(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
}

async function createProduct(data) {
  return Product.create(data);
}

async function updateProduct(id, data) {
  const product = await Product.findByPk(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  await product.update(data);
  return product;
}

async function deleteProduct(id) {
  const product = await Product.findByPk(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  await product.destroy();
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
