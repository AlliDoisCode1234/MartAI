import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts', 'convex/**/*.test.ts'],
    globals: true,
    server: {
      deps: {
        inline: ['convex-test'],
      },
    },
    // Test environment variables
    env: {
      // Random 64-char hex key for test encryption (DO NOT use in production)
      // Generated with: openssl rand -hex 32
      CREDENTIAL_ENCRYPTION_KEY: 'a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
