/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['./tests/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    // To ignore an individual file add this on line one `/* istanbul ignore file */`
    './src/**/*.ts',
    '!./src/migrations/**',
    '!./src/@types/**',
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
