var tests = require('./differ-tests.js');
var LooksSameAdapter = require('mugshot-looks-same');

describe('LooksSame Adapter', function() {
  tests(function() {
    return new LooksSameAdapter();
  });
});
