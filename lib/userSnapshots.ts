/**
 * User snapshot utilities
 * Create safe, partial user types that exclude sensitive data
 */

import type { User, UserSnapshot, AuthUser } from '@/types';

/**
 * Create a safe user snapshot excluding sensitive fields
 * Never expose passwordHash, internal IDs, or other sensitive data
 */
export function createUserSnapshot(user: User | null | undefined): UserSnapshot | null {
  if (!user) return null;

  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

/**
 * Create minimal auth user from full user
 */
export function createAuthUser(user: User | null | undefined): AuthUser | null {
  if (!user) return null;

  return {
    userId: user._id.toString(),
    email: user.email,
  };
}

/**
 * Type guard to check if object is a User (has passwordHash)
 */
export function isFullUser(obj: any): obj is User {
  return obj && typeof obj === 'object' && 'passwordHash' in obj;
}

/**
 * Type guard to check if object is a UserSnapshot (no passwordHash)
 */
export function isUserSnapshot(obj: any): obj is UserSnapshot {
  return (
    obj &&
    typeof obj === 'object' &&
    '_id' in obj &&
    'email' in obj &&
    !('passwordHash' in obj)
  );
}

