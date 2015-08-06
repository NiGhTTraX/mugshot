var test = require('./differ-tests.js');
var LooksSameAdaptor = require('../lib/adaptors/looks-same.js');

describe('LooksSame Adaptor', function() {
  test(function() {
    return new LooksSameAdaptor();
  });
});
