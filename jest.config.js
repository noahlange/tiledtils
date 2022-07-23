module.exports = {
  coveragePathIgnorePatterns: ['<rootDir>/src/tests/helpers'],
  globals: { 'ts-jest': { useESM: true } },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  verbose: true
};
