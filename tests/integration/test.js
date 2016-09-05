var expect = require('chai').expect;
var wdio = require('webdriverio');
var Mugshot = require('../../lib/mugshot.js');
var WdioAdapter = require('mugshot-webdriverio');
var path = require('path');
var fs = require('fs');

const URL = 'file://' + path.join(__dirname, 'test.html');

const BROWSER_OPTIONS = {
  desiredCapabilities: {
    browserName: 'phantomjs'
  }
};

const name = 'great',
      ext = '.png',
      dir = 'visual-tests',
      paths = [path.join(dir, name + ext),
               path.join(dir, name + '.new' + ext),
               path.join(dir, name + '.diff' + ext)];

const notUniqueSelector = {
        name: name,
        selector: 'li'
      },
      brokenSelector = {
        name: name,
        selector: 'anything'
      },
      differencesSelector = {
        name: name
      },
      noDifferencesSelector = {
        name: name,
        selector: '#rectangle'
      },
      noDifferencesResult = {
        isEqual: true,
        baseline: paths[0]
      },
      differencesResult = {
        isEqual: false,
        baseline: paths[0],
        screenshot: paths[1],
        diff: paths[2]
      };

function cleanUp() {
  for (var i = 0; i < paths.length; i++) {
    try {
      fs.unlinkSync(paths[i]);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  try {
    fs.rmdirSync(dir);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

describe('Mugshot integration', function() {
  this.timeout(0);

  var wdioInstance, mugshot;

  before(function() {

    return wdioInstance =
        wdio.remote(BROWSER_OPTIONS).init().url(URL).then(function() {
          var browser = new WdioAdapter(this);
          mugshot = new Mugshot(browser);
        });
  });

  beforeEach(function(done) {
    cleanUp();

    mugshot.test(noDifferencesSelector, function(error) {
      if (error) {
        throw error;
      }

      done();
    });
  });

  it('should call the cb with error', function(done) {
    mugshot.test(notUniqueSelector, function(error, result) {
      expect(error).to.be.an.instanceof(Error);
      expect(result).to.be.undefined;

      done();
    });
  });

  it('should call the cb with error', function(done) {
    mugshot.test(brokenSelector, function(error, result) {
      expect(error).to.be.an.instanceof(Error);
      expect(result).to.be.undefined;

      done();
    });
  });

  it('should be true and contain only baseline path if there is no previous ' +
     'baseline', function(done) {
    cleanUp();

    mugshot.test(noDifferencesSelector, function(error, result) {
      expect(error).to.be.null;
      expect(result).to.be.deep.equal(noDifferencesResult);

      done();
    });
  });

  it('should be true and contain only baseline path if there are no ' +
     'differences', function(done) {
    mugshot.test(noDifferencesSelector, function(error, result) {
      expect(error).to.be.null;
      expect(result).to.be.deep.equal(noDifferencesResult);

      done();
    });
  });

  it('should be false and contain all images paths if there are differences',
      function(done) {
        mugshot.test(differencesSelector, function(error, result) {
          expect(error).to.be.null;
          expect(result).to.be.deep.equal(differencesResult);

          done();
        });
      });

  after(function() {
    cleanUp();
    return wdioInstance.end();
  });
});

describe('Mugshot integration with disabled acceptFirstBaseline', function() {
  this.timeout(0);

  var wdioInstance, mugshot;

  before(function() {

    var mugshotOptions = {
      acceptFirstBaseline: false
    };

    return wdioInstance =
        wdio.remote(BROWSER_OPTIONS).init().url(URL).then(function() {
          var browser = new WdioAdapter(this);
          mugshot = new Mugshot(browser, mugshotOptions);
        });
  });

  beforeEach(function(done) {
    cleanUp();
    done();
  });

  it('should throw an error if there is no baseline', function(done) {
    cleanUp();

    mugshot.test(noDifferencesSelector, function(error) {
      expect(error).to.be.an.instanceof(Error);

      done();
    });
  });

  after(function() {
    cleanUp();
    return wdioInstance.end();
  });
});
