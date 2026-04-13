const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRoutes);

app.use(errorMiddleware);

module.exports = app;
