var expect = require('chai').expect;
var wdio = require('webdriverio');
var Mugshot = require('../../lib/mugshot.js');
var WdioAdapter = require('mugshot-webdriverio');
var path = require('path');
var tmp = require('tmp');

const URL = 'file://' + path.join(__dirname, 'test.html');

const BROWSER_OPTIONS = {
  desiredCapabilities: {
    browserName: 'phantomjs'
  }
};

const name = 'great',
      ext = '.png',
      extendedDir = 'visual-tests-extended/components/rectangle';

const noDifferencesSelector = {
  name: name,
  selector: '#rectangle'
};

describe('Mugshot integration with recursive rootDirectory', function() {
  this.timeout(0);
  var wdioInstance, browser;
  before(function() {

    return wdioInstance = wdio.remote(BROWSER_OPTIONS).init().url(URL)
        .then(function() {
          browser = new WdioAdapter(this);
        });
  });

  it('should create the desired rootDirectory', function(done) {
    tmp.dir({unsafeCleanup: true},
        function _tempDirCreated(error, tempPath) {
          if (error) {
            throw error;
          }

          var mugshotOptions = {
                rootDirectory: path.join(tempPath, extendedDir)
              },
              expected = {
                isEqual: true,
                baseline: path.join(tempPath, extendedDir,
                    noDifferencesSelector.name + ext)
              },
              mugshot = new Mugshot(browser, mugshotOptions);

          mugshot.test(noDifferencesSelector, function(error, result) {
            expect(error).to.be.null;
            expect(result).to.be.deep.equal(expected);

            done();
          });
        });
  });

  after(function() {
    return wdioInstance.end();
  });
});
