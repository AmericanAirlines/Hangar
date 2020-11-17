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
  collectCoverageFrom: ['./src/**/*.ts', '!./src/migration/**', '!./src/tests/**', '!./src/index.ts', '!./src/slack/**', '!./src/discord/index.ts'],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      statements: 35,
      branches: 5,
      functions: 8,
      lines: 40,
    },
    './src/entities/': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
