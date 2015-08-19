var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../lib/mugshot.js');
var path = require('path');

chai.use(require('sinon-chai'));

describe('With baseline', function() {
  var noSelector = {name: 'path'},
      baseline = new Buffer('bXVnc2hvdA=='),
      screenshot = new Buffer('ZmxvcmVudGlu'),
      error = new Error('Fatal Error'),
      rootDirectory = 'visual-tests',
      extension = '.png',
      baselinePath = path.join(rootDirectory, noSelector.name + extension),
      callback, mugshot, browser, FS, differ;

  beforeEach(function() {
    browser = {
      takeScreenshot: sinon.stub().yields(null, screenshot)
    };

    FS = {
      exists: sinon.stub(),
      readFile: sinon.stub(),
      writeFile: sinon.stub(),
      mkdir: sinon.stub().yields(null)
    };

    differ = {
      isEqual: sinon.stub()
    };

    callback = sinon.spy();

    var options = {
      fs: FS,
      differ: differ
    };

    mugshot = new Mugshot(browser, options);
  });

  it('should verify that a baseline exists', function() {
    mugshot.test(noSelector, callback);

    expect(FS.exists).to.have.been.calledWith(baselinePath, sinon.match.func);
  });

  it('should not write the screenshot on disk',
     function() {
    FS.exists.yields(true);

    mugshot.test(noSelector, callback);

    expect(FS.writeFile).to.not.have.been.called;
  });

  it('should read the baseline from disk', function() {
    FS.exists.yields(true);

    mugshot.test(noSelector, callback);

    expect(FS.readFile).to.have.been.calledWith(baselinePath,
      sinon.match.func);
  });

  it('should call the cb with error if the baseline cannot be read',
     function() {
    FS.exists.yields(true);
    FS.readFile.yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should compare the baseline and the screenshot', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);

    mugshot.test(noSelector, callback);

    expect(differ.isEqual).to.have.been.calledWith(baseline, screenshot,
      sinon.match.func);
  });

  it('should call the cb with error if the comparison fails', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });
});
