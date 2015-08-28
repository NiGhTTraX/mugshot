var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../../lib/mugshot.js');
var path = require('path');

describe('No differences', function() {
  var noSelector = {name: 'path'},
      baseline = new Buffer('bXVnc2hvdA=='),
      screenshot = new Buffer('ZmxvcmVudGlu'),
      error = new Error('Fatal Error'),
      rootDirectory = 'visual-tests',
      extension = '.png',
      screenshotPath = path.join(rootDirectory, noSelector.name + '.new' +
        extension),
      diffPath = path.join(rootDirectory, noSelector.name + '.diff' +
        extension),
      callback, mugshot, browser, FS, differ;

  beforeEach(function() {
    browser = {
      takeScreenshot: sinon.stub().yields(null, screenshot)
    };

    FS = {
      exists: sinon.stub().yields(true),
      readFile: sinon.stub().yields(null, baseline),
      writeFile: sinon.stub(),
      mkdir: sinon.stub().yields(null),
      unlink: sinon.stub()
    };

    differ = {
      isEqual: sinon.stub().yields(null, true),
      createDiff: sinon.stub()
    };

    callback = sinon.spy();

    var options = {
      fs: FS,
      differ: differ
    };

    mugshot = new Mugshot(browser, options);
  });

  it('should not create a diff', function() {
    mugshot.test(noSelector, callback);

    expect(differ.createDiff).to.not.have.been.called;
  });

  it('should try to unlink old screenshot', function() {
    mugshot.test(noSelector, callback);

    expect(FS.unlink).to.have.been.calledWith(screenshotPath,
      sinon.match.func);
  });

  it('should try to unlink old diff',
     function() {
    FS.unlink.onFirstCall().yields(null);

    mugshot.test(noSelector, callback);

    expect(FS.unlink).to.have.been.calledWith(diffPath, sinon.match.func);
  });

  it('should not throw an error if the screenshot is not there', function() {
    var error = {code: 'ENOENT'};
    FS.unlink.onFirstCall().yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.not.have.been.calledWith(error);
  });

  it('should not throw an error if the diff is not there', function() {
    var error = {code: 'ENOENT'};
    FS.unlink.onFirstCall().yields(null);
    FS.unlink.onSecondCall().yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.not.have.been.calledWith(error);
  });

  it('should throw an error if the screenshot couldn\'t be unlinked',
     function() {
    FS.unlink.onFirstCall().yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should throw an error if the diff couldn\'t be unlinked',
     function() {
    FS.unlink.onFirstCall().yields(null);
    FS.unlink.onSecondCall().yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should return true through the cb', function() {
    FS.unlink.yields(null);
    FS.unlink.yields(null);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(null, true);
  });
});
