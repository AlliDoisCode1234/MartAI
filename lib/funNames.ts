/**
 * Fun Name Generator
 *
 * Generates friendly project/user names like Convex does.
 * Examples: "cosmic-nebula-42", "swift-falcon-17"
 *
 * Based on user ID or email hash for consistency.
 */

// Adjectives - positive, energetic words
const ADJECTIVES = [
  'swift',
  'cosmic',
  'stellar',
  'lunar',
  'solar',
  'bright',
  'bold',
  'fierce',
  'calm',
  'noble',
  'rapid',
  'agile',
  'clever',
  'vivid',
  'grand',
  'prime',
  'elite',
  'alpha',
  'omega',
  'zen',
  'epic',
  'wise',
  'keen',
  'spark',
  'blaze',
];

// Nouns - animals, celestial objects, nature
const NOUNS = [
  'falcon',
  'phoenix',
  'tiger',
  'eagle',
  'wolf',
  'nebula',
  'comet',
  'quasar',
  'nova',
  'pulsar',
  'thunder',
  'river',
  'summit',
  'aurora',
  'cascade',
  'ember',
  'frost',
  'breeze',
  'storm',
  'crystal',
  'cedar',
  'sage',
  'iris',
  'lotus',
  'maple',
];

/**
 * Simple hash function for strings
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate a fun name from a seed (like user ID or email)
 *
 * @param seed - Unique identifier to generate name from
 * @returns Fun name like "cosmic-nebula-42"
 *
 * @example
 * generateFunName('user_abc123') // "swift-falcon-17"
 * generateFunName('joe@example.com') // "stellar-phoenix-42"
 */
export function generateFunName(seed: string): string {
  const hash = simpleHash(seed);

  const adjIndex = hash % ADJECTIVES.length;
  const nounIndex = Math.floor(hash / ADJECTIVES.length) % NOUNS.length;
  const number = (hash % 99) + 1; // 1-99

  return `${ADJECTIVES[adjIndex]}-${NOUNS[nounIndex]}-${number}`;
}

/**
 * Generate a display name for a user
 * If they have a real name, use it; otherwise generate a fun name
 *
 * @param user - User object with optional name and email
 * @returns Display name
 */
export function getUserDisplayName(user: {
  name?: string | null;
  email?: string | null;
  _id?: string;
}): string {
  // If user has a real name, use it
  if (user.name && user.name.trim()) {
    return user.name;
  }

  // Generate fun name from email or ID
  const seed = user.email || user._id || 'anonymous';
  return generateFunName(seed);
}

/**
 * Get initials for avatar
 *
 * @param displayName - The display name to get initials from
 * @returns 1-2 character initials
 */
export function getInitials(displayName: string): string {
  // For fun names like "cosmic-nebula-42", use first letter of each part
  if (displayName.includes('-')) {
    const parts = displayName.split('-').filter((p) => isNaN(Number(p)));
    return parts
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  }

  // For real names like "John Doe", use initials
  return displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
