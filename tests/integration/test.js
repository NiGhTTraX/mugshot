var expect = require('chai').expect;
var wdio = require('webdriverio');
var Mugshot = require('../../lib/mugshot.js');
var WdioAdapter = require('../../lib/adapters/webdriverio.js');
var path = require('path');
var fs = require('fs');

var name = 'great';
var ext = '.png';
var dir = path.join(__dirname, '..', '..', 'visual-tests');

function cleanUp() {
  var paths = [path.join(dir, name + ext), path.join(dir, name + '.new' + ext),
               path.join(dir, name + '.diff' + ext)];

  for (var i = 0; i < paths.length; i++) {
    try {
      fs.unlinkSync(paths[i]);
    } catch(error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  try {
    fs.rmdirSync(dir);
  } catch(error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

describe('Mugshot integration', function() {
  this.timeout(0);

  var url = 'file://' + path.join(__dirname, 'test.html'),
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
      wdioInstance, mugshot;

  before(function() {
    var options = {
      desiredCapabilities: {
        browserName: 'phantomjs'
      }
    };

    return wdioInstance = wdio.remote(options).init().url(url).then(function() {
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
    mugshot.test(brokenSelector, function(error, result) {
      expect(error).to.be.an.instanceof(Error);
      expect(result).to.be.undefined;

      done();
    });
  });

  it('should be true if there is no previous baseline', function(done) {
    cleanUp();

    mugshot.test(noDifferencesSelector, function(error, result) {
      expect(error).to.be.null;
      expect(result).to.be.true;

      done();
    });
  });

  it('should be true if there are no differences', function(done) {
    mugshot.test(noDifferencesSelector, function(error, result) {
      expect(error).to.be.null;
      expect(result).to.be.true;

      done();
    });
  });

  it('should be false if there are differences', function(done) {
    mugshot.test(differencesSelector, function(error, result) {
      expect(error).to.be.null;
      expect(result).to.be.false;

      done();
    });
  });

  after(function() {
    cleanUp();
    return wdioInstance.end();
  });
});
