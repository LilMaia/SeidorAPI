export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.mjs?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node', 'ts', 'mjs'],
  testMatch: [
    '**/tests/**/*.[jt]s?(x)', // Ajuste para o seu diretório de testes
    '**/?(*.)+(spec|test).[tj]s?(x)'
  ],
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
};
