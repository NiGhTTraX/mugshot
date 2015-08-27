var tests = require('./differ-tests.js');
var LooksSameAdapter = require('../../lib/adapters/looks-same.js');

describe('LooksSame Adapter', function() {
  tests(function() {
    return new LooksSameAdapter();
  });
});
