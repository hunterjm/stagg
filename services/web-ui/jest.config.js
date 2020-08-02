module.exports = {
  verbose: true,
  preset: 'ts-jest',
  roots: ['<rootDir>/__tests__/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^.+\\.svg$': '<rootDir>/config/jest/svgTransform.js',
  },
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>[/\\\\](node_modules|.next|public)[/\\\\]',
  ],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  globals: {
    'ts-jest': {
      babelConfig: 'babel.config.js',
    },
  },
};
