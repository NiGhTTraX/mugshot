module.exports = {
  'root': true,

  'extends': [
    '@nighttrax/eslint-config-ts',
    'prettier',
    'prettier/@typescript-eslint'
  ],

  'plugins': ['prettier'],

  'rules': {
    'prettier/prettier': 'error',

    // Allow `constructor(private foo: number) {}`
    'no-useless-constructor': 0,
    'no-empty-function': ['error', {
      'allow': ['constructors']
    }]
  }
};
