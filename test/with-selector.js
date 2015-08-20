var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../lib/mugshot.js');
var path = require('path');

chai.use(require('sinon-chai'));

describe('With selector', function() {
  var withSelector = {
        name: 'path',
        selector: 'a dom selector'
      },
      rect = {
        width: 100,
        height: 100,
        top: 50,
        left: 50
      },
      screenshot = new Buffer('ZmxvcmVudGlu'),
      error = new Error('Fatal Error'),
      rootDirectory = 'visual-tests',
      extension = '.png',
      baselinePath = path.join(rootDirectory, withSelector.name + extension),
      callback, mugshot, browser, PNGProcessor, FS;

  beforeEach(function() {
    browser = {
      takeScreenshot: sinon.stub().yields(null, screenshot),
      getBoundingClientRect: sinon.stub()
    };

    FS = {
      mkdir: sinon.stub().yields(null),
      exists: sinon.stub()
    };

    PNGProcessor = {
      crop: sinon.stub()
    };

    callback = sinon.spy();

    var options = {
      fs: FS,
      PNGProcessor: PNGProcessor
    };

    mugshot = new Mugshot(browser, options);
  });

  it('should get the bounding rect', function() {
    mugshot.test(withSelector, callback);

    expect(browser.getBoundingClientRect).to.have.been.calledWith(
      withSelector.selector, sinon.match.func);
  });

  it('should call the cb with error if the bounding rect couldn\'t be ' +
     'calculated', function() {
    browser.getBoundingClientRect.yields(error);

    mugshot.test(withSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should crop the image', function() {
    browser.getBoundingClientRect.yields(null, rect);

    mugshot.test(withSelector, callback);

    expect(PNGProcessor.crop).to.have.been.calledWith(screenshot, rect,
      sinon.match.func);
  });

  it('should call the cb with error if the screenshot couldn\'t be cropped',
     function() {
    browser.getBoundingClientRect.yields(null, rect);
    PNGProcessor.crop.yields(error);

    mugshot.test(withSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should check if a baseline exists', function() {
    browser.getBoundingClientRect.yields(null, rect);
    PNGProcessor.crop.yields(null, rect);

    mugshot.test(withSelector, callback);

    expect(FS.exists).to.have.been.calledWith(baselinePath, sinon.match.func);
  });
});
