import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

const EXPIRES_IN = '30d' // long-lived session token; revoke by rotating JWT_SECRET if ever needed

export function signToken(user) {
  return jwt.sign({ sub: user.id, phone: user.phone }, env.jwtSecret, { expiresIn: EXPIRES_IN })
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret) // throws if invalid/expired — caller should catch
}
