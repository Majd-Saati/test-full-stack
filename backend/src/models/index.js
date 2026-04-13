const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');
const defineUser = require('./User');
const defineProduct = require('./Product');

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: dbConfig.define,
  }
);

const User = defineUser(sequelize);
const Product = defineProduct(sequelize);

module.exports = {
  sequelize,
  User,
  Product,
};
