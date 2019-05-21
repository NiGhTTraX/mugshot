const config = {
  presets: [
    '@babel/typescript',
    ['@babel/env', { targets: { node: 'current' } }]
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', {
      legacy: true
    }],
    '@babel/plugin-proposal-class-properties'
  ]
};

if (process.env.COVERAGE) {
  config.overrides = [{
    test: /src/,
    plugins: ['istanbul']
  }];
}

module.exports = config;
