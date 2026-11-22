module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.ts',
    '<rootDir>/tests/integration/**/*.spec.ts',
    '<rootDir>/tests/e2e/**/*.spec.ts',
  ],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'apps/api/tsconfig.json' }],
  },
  testEnvironment: 'node',
};