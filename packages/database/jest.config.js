module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['./tests/setupTests.ts'],
  clearMocks: true,
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage',
  collectCoverageFrom: ['./src/**/*.ts', '!./src/seeds', '!./src/migrations'],
  // coverageThreshold: {
  //   global: {
  //     statements: 100,
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //   },
  // },
};
