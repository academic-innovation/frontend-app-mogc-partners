const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('eslint', {
  ignorePatterns: ["module.config.js"],
  rules: {
    'max-len': ['error', 88, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }]
  },
});
