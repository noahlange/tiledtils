export default {
  coveragePathIgnorePatterns: ['<rootDir>/src/tests/helpers'],
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.ts']
};
