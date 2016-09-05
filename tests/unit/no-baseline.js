var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../../lib/mugshot.js');
var path = require('path');

chai.use(require('sinon-chai'));

describe('No baseline', function() {
  var noSelector = {name: 'path'},
      screenshot = new Buffer('ZmxvcmVudGlu'),
      error = new Error('Fatal Error'),
      rootDirectory = 'visual-tests',
      extension = '.png',
      baselinePath = path.join(rootDirectory, noSelector.name + extension),
      result = {
        isEqual: true,
        baseline: baselinePath
      },
      callback, mugshot, browser, FS, differ;

  beforeEach(function() {
    browser = {
      takeScreenshot: sinon.stub().yields(null, screenshot)
    };

    FS = {
      exists: sinon.stub().yields(false),
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

  it('should not try to read a baseline from disk', function() {
    mugshot.test(noSelector, callback);

    expect(FS.readFile).to.not.have.been.called;
  });

  it('should not try to compare', function() {
    mugshot.test(noSelector, callback);

    expect(differ.isEqual).to.not.have.been.called;
  });

  it('should write the screenshot on disk', function() {
    mugshot.test(noSelector, callback);

    expect(FS.writeFile).to.have.been.calledWith(baselinePath, screenshot,
        sinon.match.func);
  });

  it('should call the cb with error if the screenshot cannot be written',
      function() {
        FS.writeFile.yields(error);

        mugshot.test(noSelector, callback);

        expect(callback).to.have.been.calledWithExactly(error);
      });

  it('should return true and only baseline path through the cb', function() {
    FS.writeFile.yields(null);

    mugshot.test(noSelector, callback);

    expect(callback).to.have.been.calledWithExactly(null, result);
  });

  it('should throw an error when acceptFirstBaseline is disabled and ' +
     'baseline doesn\'t exist.', function() {
    FS.writeFile.yields(null);

    var options = {
      fs: FS,
      differ: differ,
      acceptFirstBaseline: false
    };

    // create local mugshot instance with different options
    var mugshot = new Mugshot(browser, options);

    mugshot.test(noSelector, callback);
    expect(callback)
        .to.have.been.calledWithExactly(new Error('Baseline missing'));
  });
});
