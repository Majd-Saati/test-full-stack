const asyncHandler = require('../utils/asyncHandler');
const productService = require('../services/product.service');

const list = asyncHandler(async (req, res) => {
  const products = await productService.listProducts();
  res.json(products);
});

const getById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(Number(req.params.id));
  res.json(product);
});

const create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
});

const update = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(Number(req.params.id), req.body);
  res.json(product);
});

const remove = asyncHandler(async (req, res) => {
  await productService.deleteProduct(Number(req.params.id));
  res.status(204).send();
});

module.exports = { list, getById, create, update, remove };
