export const testEnvironment = 'node';
export const transform = {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.ts?$': 'ts-jest',
};
export const moduleNameMapper = {
    '^@/(.*)$': '<rootDir>/$1',
};
export const moduleFileExtensions = ['js', 'jsx', 'json', 'node', 'ts'];