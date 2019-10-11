module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'src/tsconfig.json',
    },
  },
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'ts',
    'tsx',
  ],
  roots: [
    'src',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '**/*.test.(ts|js)',
  ],
  testEnvironment: 'node',
  preset: 'ts-jest',
}
