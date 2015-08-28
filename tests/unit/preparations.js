var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../../lib/mugshot.js');

chai.use(require('sinon-chai'));

describe('Preparations', function() {
  var noSelector = {name: 'path'},
      error = new Error('Fatal Error'),
      rootDirectory = 'visual-tests',
      callback, mugshot, browser, FS;

  beforeEach(function() {
    browser = {
      takeScreenshot: sinon.stub()
    };

    FS = {
      mkdir: sinon.stub()
    };

    callback = sinon.spy();

    var options = {
      fs: FS
    };

    mugshot = new Mugshot(browser, options);
  });

  it('should create the rootDirectory', function() {
    mugshot.test(noSelector, callback);

    expect(FS.mkdir).to.have.been.calledWith(rootDirectory, sinon.match.func);
  });

  it('should not call the cb with error if the rootDirectory already exists',
     function() {
    var error = {code: 'EEXIST'};
    FS.mkdir.yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.not.called;
  });

  it('should call the cb with error if mkdir callback receives another error',
     function() {
    FS.mkdir.yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should call the browser to take a screenshot', function() {
    FS.mkdir.yields(null);

    mugshot.test(noSelector, callback);

    expect(browser.takeScreenshot).to.have.been.calledOnce;
  });

  it('should call the cb with error if the screenshot fails', function() {
    FS.mkdir.yields(null);
    browser.takeScreenshot.yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });
});
