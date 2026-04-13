const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');

const list = asyncHandler(async (req, res) => {
  const users = await userService.listUsers();
  res.json(users);
});

const getById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(Number(req.params.id));
  res.json(user);
});

const create = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
});

const update = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(Number(req.params.id), req.body);
  res.json(user);
});

const remove = asyncHandler(async (req, res) => {
  await userService.deleteUser(Number(req.params.id));
  res.status(204).send();
});

module.exports = { list, getById, create, update, remove };
