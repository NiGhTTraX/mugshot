// There's no way to pass the `extensions` option via CLI.
require('@babel/register')({
  extensions: ['.ts', '.tsx', '.js'],
  rootMode: 'upward'
});
