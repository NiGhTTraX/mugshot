var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../lib/mugshot.js');

chai.use(require('sinon-chai'));

describe('Mugshot', function() {
  var dummySelector = {
        name: 'path'
      },
      error = new Error('Fatal Error'),
      baseline = new Buffer('bXVnc2hvdA=='),
      screenshot = new Buffer('ZmxvcmVudGlu'),
      diff = new Buffer('anything'),
      mugshot, browser,
      FS, differ;

  beforeEach(function() {
    browser = {
      takeScreenshot: sinon.stub().yields(null, screenshot)
    };

    FS = {
      exists: sinon.stub(),
      readFile: sinon.stub(),
      writeFile: sinon.stub()
    };

    differ = {
      isEqual: sinon.stub(),
      createDiff: sinon.stub()
    };

    var options = {
      differ: differ,
      fs: FS
    };

    mugshot = new Mugshot(browser, options);
  });

  it('should throw an error if no selector is provided', function() {
    expect(mugshot.test.bind(mugshot)).to.throw(Error);
  });

  it('should throw an error if the parameter is not an object', function() {
    expect(mugshot.test.bind(mugshot, function() {})).to.throw(Error);
  });

  it('should throw an error if the parameter is an array', function() {
    expect(mugshot.test.bind(mugshot, [])).to.throw(Error);
  });

  it('should throw an error if the object has no name property', function() {
    expect(mugshot.test.bind(mugshot, {})).to.throw(Error);
  });

  it('should call the browser to take a screenshot', function() {
    mugshot.test(dummySelector);

    expect(browser.takeScreenshot).to.have.been.calledOnce;
  });

  it('should throw an error if the screenshot fails', function() {
    browser.takeScreenshot.yields(error);

    expect(mugshot.test.bind(mugshot, dummySelector)).to.throw(Error);
  });

  it('should verify if a baseline already exists', function() {
    mugshot.test(dummySelector);

    expect(FS.exists).to.have.been.calledWith(dummySelector.name);
  });

  it('should write the screenshot on disk if no baseline exists', function() {
    FS.exists.yields(false);

    mugshot.test(dummySelector);

    expect(FS.writeFile).to.have.been.calledWith(dummySelector.name, screenshot,
      sinon.match.func);
  });

  it('should throw an error if the screenshot cannot be written', function() {
    FS.exists.yields(false);
    FS.writeFile.yields(error);

    expect(mugshot.test.bind(mugshot, dummySelector)).to.throw(Error);
  });

  it('should not write the screenshot on disk if there is already a baseline',
    function() {
      FS.exists.yields(true);

      mugshot.test(dummySelector);

      expect(FS.writeFile).to.not.have.been.called;
    });

  it('should read the baseline from disk if it exists', function() {
    FS.exists.yields(true);

    mugshot.test(dummySelector);

    expect(FS.readFile).to.have.been.calledWith(dummySelector.name,
      sinon.match.func);
  });

  it('should throw an error if the baseline cannot be read', function() {
    FS.exists.yields(true);
    FS.readFile.yields(error);

    expect(mugshot.test.bind(mugshot, dummySelector)).to.throw(Error);
  });

  it('should not read a baseline from disk if there is none', function() {
    FS.exists.yields(false);

    mugshot.test(dummySelector);

    expect(FS.readFile).to.not.have.been.called;
  });

  it('should call the differ to compare the baseline from the fs with the ' +
     'screenshot from the browser', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);

    mugshot.test(dummySelector);

    expect(differ.isEqual).to.have.been.calledWith(baseline, screenshot,
      sinon.match.func);
  });

  it('should throw an error if the comparison fails', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(error);

    expect(mugshot.test.bind(mugshot, dummySelector)).to.throw(Error);
  });

  it('should not compare if there is no baseline', function() {
    FS.exists.yields(false);
    FS.readFile.yields(null, baseline);

    mugshot.test(dummySelector);

    expect(differ.isEqual).to.not.have.been.called;
  });

  it('should create a diff only if there are differences', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);

    mugshot.test(dummySelector);

    expect(differ.createDiff).to.have.been.calledWith(baseline, screenshot,
      sinon.match.func);
  });

  it('should throw an error if the diff building fails', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(error);

    expect(mugshot.test.bind(mugshot, dummySelector)).to.throw(Error);
  });

  it('should not create a diff if there are no differences', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, true);

    mugshot.test(dummySelector);

    expect(differ.createDiff).to.not.have.been.called;
  });

  it('should call the fs to write the diff on disk', function() {
    var diffName = dummySelector.name + '.diff.png';
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(null, diff);

    mugshot.test(dummySelector);

    expect(FS.writeFile).to.have.been.calledWith(diffName, diff,
      sinon.match.func);
  });

  it('should throw an error if the diff cannot be written', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(null, diff);
    FS.writeFile.yields(error);

    expect(mugshot.test.bind(mugshot, dummySelector)).to.throw(Error);
  });

  it('should not call the fs to write the diff on disk if there is none',
    function() {
      FS.exists.yields(true);
      FS.readFile.yields(null, baseline);
      differ.isEqual.yields(null, true);

      mugshot.test(dummySelector);

      expect(FS.writeFile).to.not.have.been.called;
    }
  );

  it('should call the fs to write the screenshot on disk', function() {
    var screenshotName = dummySelector.name + '.new.png';
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(null, diff);

    mugshot.test(dummySelector);

    expect(FS.writeFile).to.have.been.calledWith(screenshotName, screenshot,
      sinon.match.func);
  });

  it('should throw an error if the screenshot cannot be written', function() {
    FS.exists.yields(true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(null, diff);
    FS.writeFile.onSecondCall().yields(error);

    expect(mugshot.test.bind(mugshot, dummySelector)).to.throw(Error);
  });
});
