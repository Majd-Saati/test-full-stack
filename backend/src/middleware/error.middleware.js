function errorMiddleware(err, req, res, next) {
  // eslint-disable-next-line no-unused-vars
  const _next = next;

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'A record with this value already exists' });
  }
  if (err.name === 'SequelizeValidationError') {
    const msg = err.errors?.map((e) => e.message).join(', ') || 'Validation error';
    return res.status(400).json({ error: msg });
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const payload = { error: message };
  if (process.env.NODE_ENV === 'development' && err.stack) {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
}

module.exports = errorMiddleware;
