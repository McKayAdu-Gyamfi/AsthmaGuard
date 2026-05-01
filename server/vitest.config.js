import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load .env.test when running in test mode (NODE_ENV=test)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    test: {
      globals: true,
      environment: 'node',
      include: ['tests/**/*.test.js'],
      env: {
        // Inject test env vars so imports that read process.env don't crash
        NODE_ENV: 'test',
        DATABASE_URL: env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test_db',
        BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET || 'ci-test-secret',
        BETTER_AUTH_URL: env.BETTER_AUTH_URL || 'http://localhost:4000',
      },
    },
  };
});

