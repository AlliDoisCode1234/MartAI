import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts', 'convex/**/*.test.ts', 'lib/**/*.test.ts'],
    globals: true,
    setupFiles: ['__tests__/setup/convexTestSetup.ts'],
    testTimeout: 60000,
    hookTimeout: 60000,
    server: {
      deps: {
        inline: ['convex-test'],
      },
    },
    fakeTimers: {
      toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'setImmediate', 'clearImmediate'],
    },
    env: {
      CREDENTIAL_ENCRYPTION_KEY: 'a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890',
      VITEST: 'true',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
