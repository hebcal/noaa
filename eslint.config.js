import {createRequire} from 'module';
import {fileURLToPath} from 'url';

const require = createRequire(import.meta.url);
const gtsConfig = require('gts/build/eslint.config.js');
const tsconfigPath = fileURLToPath(new URL('./tsconfig.json', import.meta.url));

export default [
  ...gtsConfig,
  {
    ignores: ['dist/', 'docs/', 'test/'],
  },
  {
    // gts defaults eslint.config.js to commonjs; this one is ESM.
    files: ['eslint.config.js'],
    languageOptions: {
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: tsconfigPath,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
