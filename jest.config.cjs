/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Для TypeScript файлов
    '^.+\\.js$': 'babel-jest', // Для JavaScript файлов (если используются ES-модули)
  },
  roots: ['<rootDir>/src'],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.js'], // Укажите расширения, которые должны обрабатываться как ESM
  globals: {
    'ts-jest': {
      useESM: true, // Включаем поддержку ES-модулей в ts-jest
    },
  },
};
