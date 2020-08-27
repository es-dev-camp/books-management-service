module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue', 'ts', 'tsx'],
  setupFiles: ['<rootDir>/.jest/register-context.js', 'jest-canvas-mock'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(vuetify/|@storybook/.*\\.vue$|.*\\.css$))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '<rootDir>/src/**/*.spec.(ts|tsx)',
    '<rootDir>/functions/**/*.spec.(ts|tsx)',
    '<rootDir>/storyshots/storyshots.spec.ts',
  ],
  testURL: 'http://localhost/',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!**/node_modules/**',
    '!src/**/*.d.ts',
    '!src/**/*.stories.ts',
    // TODO: テスト内容を検討中なので一旦除外
    '!src/**/App.vue',
    '!src/**/{store,main,registerServiceWorker}.ts',
  ],
  coverageReporters: ['json', 'lcov', 'text-summary'],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
};
