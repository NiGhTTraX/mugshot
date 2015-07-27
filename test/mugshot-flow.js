var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../lib/mugshot.js');

chai.use(require('sinon-chai'));

describe('Mugshot', function() {
  var mugshot,
      browser,
      FS,
      dummySelector = {
        name: 'path'
      };

  beforeEach(function() {
    browser = {
      takeScreenshot: sinon.stub()
    };

    FS = {
      exists: sinon.stub(),
      readFile: sinon.stub(),
      writeFile: sinon.stub()
    };

    var options = {
      fs: FS
    };
    
    mugshot = new Mugshot(browser, options);
  });

  it('should call the browser to take a screenshot', function() {
    mugshot.capture(dummySelector);
    
    expect(browser.takeScreenshot).have.been.calledOnce;
  });

  it('should verify if a baseline already exists', function() {
    mugshot.capture(dummySelector);

    expect(FS.exists).have.been.calledOnce;
  });

  it('should write the screenshot on disk if no baseline exists', function() {
    FS.exists.yields(null, false);
    mugshot.capture(dummySelector);

    expect(FS.writeFile).have.been.calledOnce;
  });

  it('should not write the screenshot on disk if there is already a baseline',
    function() {
      FS.exists.yields(null, true);
      mugshot.capture(dummySelector);

      expect(FS.writeFile).have.been.not.called;
    });

  it('should read the baseline from disk if it exists', function() {
    FS.exists.yields(null, true);
    mugshot.capture(dummySelector);

    expect(FS.readFile).have.been.calledOnce;
  });

  it('should not read a screenshot from disk if there is none', function() {
    FS.exists.yields(null, false);
    mugshot.capture(dummySelector);

    expect(FS.readFile).have.been.not.called;
  });
});
