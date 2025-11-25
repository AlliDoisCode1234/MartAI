/**
 * User snapshot utilities
 * Create safe, partial user types that exclude sensitive data
 */

import type { UserRecord, UserSnapshot, AuthUser } from '@/types';

/**
 * Create a safe user snapshot excluding sensitive fields
 * Never expose passwordHash, internal IDs, or other sensitive data
 */
export function createUserSnapshot(user: UserRecord | UserSnapshot | null | undefined): UserSnapshot | null {
  if (!user) return null;

  const username =
    (user as UserSnapshot).username ||
    ('email' in user ? user.email : undefined) ||
    'user';

  return {
    _id: user._id,
    username,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    preferences: user.preferences,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Create minimal auth user from full user
 */
export function createAuthUser(user: UserRecord | UserSnapshot | null | undefined): AuthUser | null {
  if (!user) return null;

  return {
    userId: user._id.toString(),
    username:
      (user as UserSnapshot).username ||
      ('email' in user ? user.email : undefined) ||
      'user',
    role: user.role,
  };
}

/**
 * Type guard to check if object is a User (has passwordHash)
 */
export function isFullUser(obj: any): obj is UserRecord {
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
    'username' in obj &&
    !('passwordHash' in obj)
  );
}

