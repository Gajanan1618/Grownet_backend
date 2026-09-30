export function notFoundHandler(req, res) {
  res.status(404).json({ error: `No route: ${req.method} ${req.path}` })
}

export function errorHandler(err, req, res, _next) {
  console.error(err) // structured logging (Sentry, etc.) plugs in right here in production

  if (err.code === '23505') {
    // Postgres unique_violation
    return res.status(409).json({ error: 'A record with this value already exists' })
  }

  const status = err.status || 500
  const message = status === 500 ? 'Something went wrong on our end' : err.message
  res.status(status).json({ error: message })
}
