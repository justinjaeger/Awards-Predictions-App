module.exports = {
  verbose: true,
  modulePaths: ["<rootDir>"],
  // setupFiles: ["dotenv/config"],
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  globalSetup: '<rootDir>/jest.setup.js',
}