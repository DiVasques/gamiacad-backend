module.exports = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageProvider: 'v8',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  globalSetup: './tests/setup.ts',
  moduleNameMapper: { '@/(.*)$': '<rootDir>/src/$1' },
  collectCoverageFrom: [
    '!<rootDir>/tests/*',
    '!<rootDir>/src/server.ts',
    '!<rootDir>/dist/**/*.js',
    '<rootDir>/src/**/*.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/config',
    '<rootDir>/src/models',
    '<rootDir>/src/ports',
    '<rootDir>/src/repository',
    '<rootDir>/src/server.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    }
  }
}
