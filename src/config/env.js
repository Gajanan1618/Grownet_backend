import 'dotenv/config'

function required(name, fallback) {
  const val = process.env[name] ?? fallback
  if (val === undefined) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return val
}

export const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: required('JWT_SECRET'),
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()),
  demoMode: (process.env.DEMO_MODE ?? 'true') === 'true',
  isProduction: process.env.NODE_ENV === 'production',
}

if (env.isProduction && env.jwtSecret.includes('dev-only')) {
  throw new Error('Refusing to start in production with the default dev JWT_SECRET. Set a real secret.')
}
