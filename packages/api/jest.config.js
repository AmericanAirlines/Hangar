module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['./tests/setupTests.ts'],
  clearMocks: true,
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    './src/**/*.ts',
    '!./src/@types/**',
    '!./src/env.ts',
    '!./src/slack/index.ts',
    '!./src/index.ts',
    '!./src/api/settings.ts',
    '!./src/utils/logger.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
