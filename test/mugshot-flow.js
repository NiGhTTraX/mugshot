var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../lib/mugshot.js');

chai.use(require('sinon-chai'));

describe('Mugshot', function() {
  var dummySelector = {
        name: 'path'
      },
      baseline = 'bXVnc2hvdA==',
      screenshot = 'ZmxvcmVudGlu',
      diff = baseline + screenshot,
      mugshot, browser,
      FS, differ;

  beforeEach(function() {
    browser = {
      takeScreenshot: sinon.stub()
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

  it('should call the browser to take a screenshot', function() {
    mugshot.test(dummySelector);

    expect(browser.takeScreenshot).to.have.been.calledOnce;
  });

  it('should verify if a baseline already exists', function() {
    mugshot.test(dummySelector);

    expect(FS.exists).to.have.been.calledWith(dummySelector.name);
  });

  it('should write the screenshot on disk if no baseline exists', function() {
    browser.takeScreenshot.returns(screenshot);
    FS.exists.yields(null, false);

    mugshot.test(dummySelector);

    expect(FS.writeFile).to.have.been.calledWith(dummySelector.name, screenshot);
  });

  it('should not write the screenshot on disk if there is already a baseline',
    function() {
      FS.exists.yields(null, true);

      mugshot.test(dummySelector);

      expect(FS.writeFile).to.not.have.been.called;
    });

  it('should read the baseline from disk if it exists', function() {
    FS.exists.yields(null, true);

    mugshot.test(dummySelector);

    expect(FS.readFile).to.have.been.calledWith(dummySelector.name);
  });

  it('should not read a baseline from disk if there is none', function() {
    FS.exists.yields(null, false);

    mugshot.test(dummySelector);

    expect(FS.readFile).to.not.have.been.called;
  });

  it('should call the differ to compare the baseline from the fs with the ' +
    'screenshot from the browser', function() {
      browser.takeScreenshot.returns(screenshot);
      FS.exists.yields(null, true);
      FS.readFile.yields(null, baseline);

      mugshot.test(dummySelector);

      expect(differ.isEqual).to.have.been.calledWith(baseline, screenshot);
  });

  it('should not compare if there is no baseline', function() {
    FS.exists.yields(null, false);
    FS.readFile.yields(null, baseline);

    mugshot.test(dummySelector);

    expect(differ.isEqual).to.not.have.been.called;
  });

  it('should create a diff only if there are differences', function() {
    browser.takeScreenshot.returns(screenshot);
    FS.exists.yields(null, true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);

    mugshot.test(dummySelector);

    expect(differ.createDiff).to.have.been.calledWith(baseline, screenshot);
  });

  it('should not create a diff if there are no differences', function() {
    FS.exists.yields(null, true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, true);

    mugshot.test(dummySelector);

    expect(differ.createDiff).to.not.have.been.called;
  });

  it('should call the fs to write the diff on disk', function() {
    var diffName = dummySelector.name + '.diff.png';
    FS.exists.yields(null, true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(null, diff);

    mugshot.test(dummySelector);

    expect(FS.writeFile).to.have.been.calledWith(diffName, diff);
  });

  it('should not call the fs to write the diff on disk if there is none',
    function() {
      var diffName = dummySelector.name + '.diff.png';
      FS.exists.yields(null, true);
      FS.readFile.yields(null, baseline);
      differ.isEqual.yields(null, true);

      mugshot.test(dummySelector);

      expect(FS.writeFile).to.not.have.been.called;
  });

  it('should call the fs to write the screenshot on disk', function() {
    var screenshotName = dummySelector.name + '.new.png';
    browser.takeScreenshot.returns(screenshot);
    FS.exists.yields(null, true);
    FS.readFile.yields(null, baseline);
    differ.isEqual.yields(null, false);
    differ.createDiff.yields(null, diff);

    mugshot.test(dummySelector);

    expect(FS.writeFile).to.have.been.calledWith(screenshotName, screenshot);
  });
});
