module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/electron',
    'plugin:import/typescript',
    'plugin:import/errors',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  plugins: ['prettier', 'react', 'import', 'jsx-a11y'],
  parser: '@typescript-eslint/parser',
  rules: {
    'prettier/prettier': 'error',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
