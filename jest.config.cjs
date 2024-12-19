/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm', // Используем ESM пресет для ES-модулей
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest', // Указываем трансформер
      {
        useESM: true, // Настройка для ES-модулей
      },
    ],
    '^.+\\.js$': 'babel-jest', // Для JavaScript файлов (ES-модули)
  },
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // Файл с дополнительной настройкой
};
