module.exports = {
  roots: [
    '<rootDir>/__tests__/',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js$',
  moduleFileExtensions: [
    'js',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
  },
  modulePathIgnorePatterns: ['/__fixtures__/'],
};
