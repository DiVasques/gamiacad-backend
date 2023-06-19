module.exports = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageProvider: "v8",
  setupFiles: ['dotenv/config'],
  globalSetup: './tests/setup.ts',
  moduleNameMapper: { '@/(.*)$': '<rootDir>/src/$1' },
  collectCoverageFrom: [
    '!<rootDir>/tests/*',
    '!<rootDir>/src/server.ts',
    '<rootDir>/src/**/*.ts'
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/config",
    "<rootDir>/src/models",
    "<rootDir>/src/repository",
    '<rootDir>/src/server.ts'
  ]
}
