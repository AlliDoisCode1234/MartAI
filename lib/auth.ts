import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// CRITICAL: JWT secrets MUST come from environment variables in production
// Never hardcode secrets or use defaults in production
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

if (!JWT_REFRESH_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_REFRESH_SECRET environment variable is required in production');
}

// Development fallbacks (NEVER use in production)
const DEV_JWT_SECRET = JWT_SECRET || 'dev-secret-key-change-in-production';
const DEV_JWT_REFRESH_SECRET = JWT_REFRESH_SECRET || DEV_JWT_SECRET + '-refresh';
const JWT_EXPIRES_IN = '15m'; // 15 minutes - short-lived access token
const JWT_REFRESH_EXPIRES_IN = '7d'; // 7 days - refresh token
const SALT_ROUNDS = 10;

import type { UserRole } from '@/types';

export interface UserPayload {
  userId: string;
  email: string;
  role?: UserRole;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate access token (short-lived)
export function generateToken(payload: UserPayload): string {
  const secret = JWT_SECRET || DEV_JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
}

// Generate refresh token (long-lived)
export function generateRefreshToken(payload: UserPayload): string {
  const secret = JWT_REFRESH_SECRET || DEV_JWT_REFRESH_SECRET;
  return jwt.sign(payload, secret, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

// Verify access token
export function verifyToken(token: string): UserPayload | null {
  try {
    const secret = JWT_SECRET || DEV_JWT_SECRET;
    return jwt.verify(token, secret) as UserPayload;
  } catch (error) {
    return null;
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): UserPayload | null {
  try {
    const secret = JWT_REFRESH_SECRET || DEV_JWT_REFRESH_SECRET;
    return jwt.verify(token, secret) as UserPayload;
  } catch (error) {
    return null;
  }
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  return { valid: true };
}

// Validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

