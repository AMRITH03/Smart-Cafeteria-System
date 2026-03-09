const path = require('path');

process.env.NEXT_PUBLIC_BACKEND_URL = "http://localhost:3001";

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  rootDir: '../../',
  testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: path.resolve(__dirname, '../../frontend/tsconfig.json')
    }]
  },
  moduleNameMapper: {
    '^@/(.*)$': [
      '<rootDir>/frontend/src/$1',
      '<rootDir>/frontend/$1'
    ]
  },
  // Ensure we don't pick up the root jest.config.js
  moduleDirectories: ['node_modules', '<rootDir>/frontend/src', '<rootDir>/frontend'],
};
