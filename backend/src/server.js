require('dotenv').config();
const app = require('./app');
const { sequelize, User, Product } = require('./models');

const PORT = Number(process.env.PORT) || 4000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDatabase(maxAttempts = 12, intervalMs = 2500) {
  let attempt = 1;
  while (attempt <= maxAttempts) {
    try {
      await sequelize.authenticate();
      return;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`Database not ready, retrying (${attempt}/${maxAttempts})...`, err.message);
      attempt += 1;
      await delay(intervalMs);
    }
  }
  throw new Error('Unable to connect to the database after multiple retries.');
}

async function bootstrap() {
  await waitForDatabase();
  await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });

  const count = await User.count();
  if (count === 0) {
    await User.create({
      email: 'admin@example.com',
      passwordHash: 'admin123',
      name: 'Admin User',
    });
    await Product.bulkCreate([
      { name: 'Sample Widget', description: 'A demo product', price: 19.99, stock: 100 },
      { name: 'Starter Kit', description: 'Everything to get started', price: 49.5, stock: 25 },
    ]);
    // eslint-disable-next-line no-console
    console.log('Seeded default admin (admin@example.com / admin123) and sample products.');
  }

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});
