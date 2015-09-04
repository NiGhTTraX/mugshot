var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../../lib/mugshot.js');
var path = require('path');

chai.use(require('sinon-chai'));

describe('With differences', function() {
  var noSelector = {name: 'path'},
      baseline = new Buffer('bXVnc2hvdA=='),
      screenshot = new Buffer('ZmxvcmVudGlu'),
      diff = new Buffer('anything'),
      error = new Error('Fatal Error'),
      rootDirectory = 'visual-tests',
      extension = '.png',
      screenshotPath = path.join(process.cwd(), rootDirectory,
        noSelector.name + '.new' + extension),
      diffPath = path.join(process.cwd(), rootDirectory,
        noSelector.name + '.diff' + extension),
      baselinePath = path.join(process.cwd(), rootDirectory,
        noSelector.name + extension),
      result = {
        isEqual: false,
        baseline: baselinePath,
        screenshot: screenshotPath,
        diff: diffPath
      },
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
      isEqual: sinon.stub().yields(null, false),
      createDiff: sinon.stub()
    };

    callback = sinon.spy();

    var options = {
      fs: FS,
      differ: differ
    };

    mugshot = new Mugshot(browser, options);
  });

  it('should create a diff', function() {
    mugshot.test(noSelector, callback);

    expect(differ.createDiff).to.have.been.calledWith(baseline, screenshot,
      sinon.match.func);
  });

  it('should call the cb with error if the diff building fails', function() {
    differ.createDiff.yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should not try to unlink old diff and screenshot', function() {
    mugshot.test(noSelector, callback);

    expect(FS.unlink).to.not.have.been.called;
  });

  it('should call the fs to write the screenshot on disk', function() {
    differ.createDiff.yields(null, diff);

    mugshot.test(noSelector, callback);

    expect(FS.writeFile).to.have.been.calledWith(screenshotPath, screenshot,
      sinon.match.func);
  });

  it('should throw an error if the screenshot cannot be written', function() {
    differ.createDiff.yields(null, diff);
    FS.writeFile.onFirstCall().yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should call the fs to write the diff on disk', function() {
    differ.createDiff.yields(null, diff);
    FS.writeFile.onFirstCall().yields(null);

    mugshot.test(noSelector, callback);

    expect(FS.writeFile).to.have.been.calledWith(diffPath, diff,
      sinon.match.func);
  });

  it('should throw an error if the diff cannot be written', function() {
    differ.createDiff.yields(null, diff);
    FS.writeFile.onFirstCall().yields(null);
    FS.writeFile.onSecondCall().yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should return false and all images paths through the callback',
     function() {
    differ.createDiff.yields(null, diff);
    FS.writeFile.yields(null);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(null, result);
  });
});
