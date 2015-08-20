var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../lib/mugshot.js');

chai.use(require('sinon-chai'));

describe('No selector', function() {
  var noSelector = {name: 'path'},
      screenshot = new Buffer('ZmxvcmVudGlu'),
      callback = function() {},
      mugshot, browser, PNGProcessor, FS;

  beforeEach(function() {
    browser = {
      takeScreenshot: sinon.stub().yields(null, screenshot),
      getBoundingClientRect: sinon.stub()
    };

    FS = {
      mkdir: sinon.stub().yields(null),
      exists: function() {}
    };

    PNGProcessor = {
      crop: sinon.stub()
    };

    var options = {
      fs: FS,
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
