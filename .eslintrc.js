module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    tsconfigRootDir: __dirname
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  rules: {
    'no-redeclare': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { ignoreRestSiblings: true, argsIgnorePattern: '_' }
    ],
    '@typescript-eslint/no-namespace': [2, { allowDeclarations: true }]
  }
};
