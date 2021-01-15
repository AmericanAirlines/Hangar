module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'src/tsconfig.json',
    },
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
  roots: ['src'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/*.test.(ts|js)'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  collectCoverageFrom: [
    './src/**/*.ts',
    '!./src/migration/**',
    '!./src/tests/**',
    '!./src/index.ts',
    '!./src/slack/**',
    '!./src/discord/index.ts',
    '!./src/logger.ts',
    '!./src/app.ts',
    '!./src/StringDictionary.ts',
    '!./src/api/admin.ts',
    '!./src/api/index.ts',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
