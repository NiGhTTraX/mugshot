module.exports = {
  presets: [
    '@babel/typescript',
    ['@babel/env', { targets: { node: 'current' } }]
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', {
      legacy: true
    }],
    '@babel/plugin-proposal-class-properties'
  ],
  overrides: [{
    test: /src/,
    plugins: ['istanbul']
  }]
};
