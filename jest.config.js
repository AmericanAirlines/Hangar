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
    '!./src/migrations/**',
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
      statements: 65,
      branches: 52,
      functions: 56.36,
      lines: 57,
    },
  },
};
