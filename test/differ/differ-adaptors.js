var tests = require('./differ-tests.js');
var LooksSameAdaptor = require('../../lib/adaptors/looks-same.js');

describe('LooksSame Adaptor', function() {
  tests(function() {
    return LooksSameAdaptor;
  });
});
