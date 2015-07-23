var expect = require('chai').expect;
var Mugshot = require('../lib/mugshot.js');

describe('Mugshot constructor', function() {
  var dummyBrowser = 'anything';

  it('should throw an error if no browser instance is provided', function() {
    expect(function() {
      new Mugshot();
    }).to.throw(Error);
  });

  it('should throw an error if options is not an object', function() {
    expect(function() {
      new Mugshot(dummyBrowser, function() {});
    }).to.throw(Error);
  });

  it('should throw an error if options is an array', function() {
    expect(function() {
      new Mugshot(dummyBrowser, []);
    }).to.throw(Error);
  });

  it('should not throw an error if options is not provided', function() {
    expect(function() {
      new Mugshot(dummyBrowser);
    }).to.not.throw(Error);
  });

  it('should not throw an error if options is an object', function() {
    expect(function() {
      new Mugshot(dummyBrowser, {});
    }).to.not.throw(Error);
  });
});
