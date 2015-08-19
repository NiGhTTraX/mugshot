var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../lib/mugshot.js');

chai.use(require('sinon-chai'));

describe('No selector', function() {
  var noSelector = {name: 'path'},
      callback = function() {},
      mugshot, browser, PNGProcessor;

  beforeEach(function() {
    browser = {
      getBoundingClientRect: sinon.stub()
    };

    PNGProcessor = {
      crop: sinon.stub()
    };

    var options = {
      PNGProcessor: PNGProcessor
    };

    mugshot = new Mugshot(browser, options);
  });

  it('should not get the bounding rect if no selector is provided',
     function() {
    mugshot.test(noSelector, callback);

    expect(browser.getBoundingClientRect).to.not.have.been.called;
  });

  it('should not crop the image if there is no selector', function() {
    mugshot.test(noSelector, callback);

    expect(PNGProcessor.crop).to.not.have.been.called;
  });
});
