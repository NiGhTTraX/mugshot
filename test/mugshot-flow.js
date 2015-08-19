var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../lib/mugshot.js');
var path = require('path');

chai.use(require('sinon-chai'));

describe('Mugshot', function() {
  var noSelector = {
        name: 'path'
      },
      withSelector = {
        name: noSelector.name,
        selector: 'a dom selector'
      },
      rect = {
        width: 100,
        height: 100,
        top: 50,
        left: 50
      },
      error = new Error('Fatal Error'),
      baseline = new Buffer('bXVnc2hvdA=='),
      screenshot = new Buffer('ZmxvcmVudGlu'),
      diff = new Buffer('anything'),
      rootDirectory = 'visual-tests',
      extension = '.png',
      baselinePath = path.join(rootDirectory, noSelector.name + extension),
      screenshotPath = path.join(rootDirectory, noSelector.name + '.new' +
        extension),
      diffPath = path.join(rootDirectory, noSelector.name + '.diff' +
        extension),
      mugshot, browser, FS, differ, PNGProcessor, callback;

  beforeEach(function() {
    browser = {
      takeScreenshot: sinon.stub().yields(null, screenshot),
      getBoundingClientRect: sinon.stub()
    };

    FS = {
      exists: sinon.stub(),
      readFile: sinon.stub(),
      writeFile: sinon.stub(),
      mkdir: sinon.stub().yields(null),
      unlink: sinon.stub()
    };

    PNGProcessor = {
      crop: sinon.stub()
    };

    differ = {
      isEqual: sinon.stub(),
      createDiff: sinon.stub()
    };

    callback = sinon.spy();

    var options = {
      differ: differ,
      fs: FS,
      PNGProcessor: PNGProcessor
    };

    mugshot = new Mugshot(browser, options);
  });

  describe('Parameters checking', function() {
    it('should throw an error if no captureItem is provided', function() {
      expect(mugshot.test.bind(mugshot)).to.throw(Error);
    });

    it('should throw an error if the captureItem is not an object', function() {
      expect(mugshot.test.bind(mugshot, function() {}, callback))
        .to.throw(Error);
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

  describe('Preparations for testing', function() {
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
      mugshot.test(noSelector, callback);

      expect(browser.takeScreenshot).to.have.been.calledOnce;
    });

    it('should call the cb with error if the screenshot fails', function() {
      browser.takeScreenshot.yields(error);

      mugshot.test(noSelector, callback);

      expect(callback).to.have.been.calledWithExactly(error);
    });
  });

  describe('No selector', function() {
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

  describe('With selector', function() {
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
  });

  describe('No baseline', function() {
    it('should verify that a baseline doesn\'t exist', function() {
      mugshot.test(noSelector, callback);

      expect(FS.exists).to.have.been.calledWith(baselinePath, sinon.match.func);
    });

    it('should write the screenshot on disk', function() {
      FS.exists.yields(false);

      mugshot.test(noSelector, callback);

      expect(FS.writeFile).to.have.been.calledWith(baselinePath, screenshot,
        sinon.match.func);
    });

    it('should throw an error if the screenshot cannot be written', function() {
      FS.exists.yields(false);
      FS.writeFile.yields(error);

      mugshot.test(noSelector, callback);

      expect(callback).to.have.been.calledWithExactly(error);
    });

    it('should not write the screenshot on disk if there is already a baseline',
       function() {
      FS.exists.yields(true);

      mugshot.test(noSelector, callback);

      expect(FS.writeFile).to.not.have.been.called;
    });
  });

  it('should read the baseline from disk if it exists', function() {
    FS.exists.yields(true);

    mugshot.test(noSelector, callback);

    expect(FS.readFile).to.have.been.calledWith(baselinePath, sinon.match.func);
  });

  it('should throw an error if the baseline cannot be read', function() {
    FS.exists.yields(true);
    FS.readFile.yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should not read a baseline from disk if there is none', function() {
    FS.exists.yields(false);

    mugshot.test(noSelector, callback);

    expect(FS.readFile).to.not.have.been.called;
  });

  it('should call the differ to compare the baseline from the fs with the ' +
     'screenshot from the browser', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);

    mugshot.test(noSelector, callback);

    expect(differ.isEqual).to.have.been.calledWith(baseline, screenshot,
      sinon.match.func);
  });

  it('should throw an error if the comparison fails', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should not compare if there is no baseline', function() {
    FS.exists.yields(false);
    FS.readFile.yields(null, baseline);

    mugshot.test(noSelector, callback);

    expect(differ.isEqual).to.not.have.been.called;
  });

  it('should create a diff only if there are differences', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);

    mugshot.test(noSelector, callback);

    expect(differ.createDiff).to.have.been.calledWith(baseline, screenshot,
      sinon.match.func);
  });

  it('should throw an error if the diff building fails', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should not create a diff if there are no differences', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, true);

    mugshot.test(noSelector, callback);

    expect(differ.createDiff).to.not.have.been.called;
  });

  it('should call the fs to write the diff on disk', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(null, diff);
    FS.writeFile.yields(null);

    mugshot.test(noSelector, callback);

    expect(FS.writeFile).to.have.been.calledWith(diffPath, diff,
      sinon.match.func);
  });

  it('should throw an error if the diff cannot be written', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(null, diff);
    FS.writeFile.onFirstCall().yields(null);
    FS.writeFile.onSecondCall().yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should not call the fs to write the diff on disk if there is none',
     function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, true);

    mugshot.test(noSelector, callback);

    expect(FS.writeFile).to.not.have.been.called;
  });

  it('should call the fs to write the screenshot on disk', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(null, diff);

    mugshot.test(noSelector, callback);

    expect(FS.writeFile).to.have.been.calledWith(screenshotPath, screenshot,
      sinon.match.func);
  });

  it('should throw an error if the screenshot cannot be written', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(null, diff);
    FS.writeFile.onFirstCall().yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should try to unlink old diff if the comparison returns true',
     function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, true);
    FS.unlink.onFirstCall().yields(null);
    mugshot.test(noSelector, callback);

    expect(FS.unlink).to.have.been.calledWith(diffPath);
  });

  it('should try to unlink old screenshot if the comparison returns true',
     function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, true);

    mugshot.test(noSelector, callback);

    expect(FS.unlink).to.have.been.calledWith(screenshotPath);
  });

  it('should not try to unlink old diff and screenshot if the comparison ' +
     'returns false', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);

    mugshot.test(noSelector, callback);

    expect(FS.unlink).to.not.have.been.called;
  });

  it('should not throw an error if the file is not there', function() {
    var error = {code: 'ENOENT'};
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, true);
    FS.unlink.yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.not.have.been.calledWith(error);
  });

  it('should throw an error if the file couldn\'t be unlinked', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, true);
    FS.unlink.yields(error);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(error);
  });

  it('should return true if there is no baseline', function() {
    FS.exists.yields(false);
    FS.writeFile.yields(null);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(null, true);
  });

  it('should return false if there are differences', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(null, diff);
    FS.writeFile.yields(null);
    FS.writeFile.yields(null);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(null, false);
  });

  it('should return true if there are no differences', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, true);
    FS.unlink.yields(null);
    FS.unlink.yields(null);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(null, true);
  });
});
