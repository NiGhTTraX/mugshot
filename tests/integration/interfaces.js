var interfaces = require('../../index.js').interfaces;
var expect = require('chai').expect;

const EXPECTED = [{
  interface: 'browser',
  functions: ['takeScreenshot', 'getBoundingClientRect']
}, {
  interface: 'differ',
  functions: ['isEqual', 'createDiff']
}, {
  interface: 'fs',
  functions: ['exists', 'readFile', 'writeFile', 'mkdir', 'unlink']
}, {
  interface: 'PNGProcessor',
  functions: ['crop']
}];

describe('Mugshot interfaces', function() {
  EXPECTED.forEach(function(item) {
    var currentInterface = item.interface;

    it(`should contain the ${currentInterface} interface`, function() {
      expect(interfaces).to.have.property(currentInterface);
    });

    describe(`${currentInterface}`, function() {
      item.functions.forEach(function(f) {
        it(`should have the ${f} function`, function() {
          expect(interfaces[currentInterface][f]).to.be.an.instanceof(Function);
        });
      });
    });
  });
});
