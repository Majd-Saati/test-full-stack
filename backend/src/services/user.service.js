const { User } = require('../models');

async function listUsers() {
  return User.findAll({ order: [['id', 'ASC']] });
}

async function getUserById(id) {
  const user = await User.findByPk(id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
}

async function createUser({ email, password, name }) {
  return User.create({ email, passwordHash: password, name });
}

async function updateUser(id, { email, name, password }) {
  const user = await User.scope('withPassword').findByPk(id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  if (email !== undefined) user.email = email;
  if (name !== undefined) user.name = name;
  if (password) user.passwordHash = password;
  await user.save();
  return User.findByPk(id);
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  await user.destroy();
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
