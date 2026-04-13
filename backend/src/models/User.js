const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash',
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
      scopes: {
        withPassword: { attributes: { include: ['passwordHash'] } },
      },
    }
  );

  User.prototype.comparePassword = function comparePassword(plain) {
    return bcrypt.compare(plain, this.passwordHash);
  };

  User.beforeCreate(async (user) => {
    if (user.passwordHash && !user.passwordHash.startsWith('$2')) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, SALT_ROUNDS);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('passwordHash') && user.passwordHash && !user.passwordHash.startsWith('$2')) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, SALT_ROUNDS);
    }
  });

  return User;
};
