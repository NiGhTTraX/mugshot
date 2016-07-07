var expect = require('chai').expect;
var Mugshot = require('../../lib/mugshot.js');

describe('Parameters checking', function() {
  var noSelector = {name: 'path'},
      callback = function() {},
      mugshot;

  beforeEach(function() {
    mugshot = new Mugshot('anything', {});
  });

  it('should throw an error if no captureItem is provided', function() {
    expect(mugshot.test.bind(mugshot)).to.throw(Error);
  });

  it('should throw an error if the captureItem is not an object', function() {
    expect(mugshot.test.bind(mugshot, function() {}, callback)).to.throw(Error);
  });

  it('should throw an error if the captureItem is an array', function() {
    expect(mugshot.test.bind(mugshot, [], callback)).to.throw(Error);
  });

  it('should throw an error if the captureItem has no name property',
      function() {
        expect(mugshot.test.bind(mugshot, {}, callback)).to.throw(Error);
      });

  it('should throw an error if no callback is provided', function() {
    expect(mugshot.test.bind(mugshot, noSelector)).to.throw(Error);
  });

  it('should throw an error if the callback is not a function', function() {
    expect(mugshot.test.bind(mugshot, noSelector, {})).to.throw(Error);
  });
});
