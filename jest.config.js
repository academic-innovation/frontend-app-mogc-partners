// eslint-disable-next-line
const { createConfig } = require('@edx/frontend-build');

const config = createConfig('jest', {
  // setupFilesAfterEnv is used after the jest environment has been loaded.  In general this is what you want.
  // If you want to add config BEFORE jest loads, use setupFiles instead.  
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
  coveragePathIgnorePatterns: [
    'src/setupTest.js',
    'src/i18n',
    'src/utils/testing',
  ],
});

// The default config in @edx/frontend-build ignores all modules that are not
// @edx, so we cannot add another pattern. We have to replace the existing
// pattern with one that handles both @edx and @openedx.
delete config['transformIgnorePatterns'];
config['transformIgnorePatterns'] = [
  '<rootDir>/node_modules/(?!@edx/|@openedx/paragon)',
]

module.exports = config;
