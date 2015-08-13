var path = require('path');

/**
 * Diffing tool instance
 *
 * @param {Differ}
 * @const
 */
var DEFAULT_DIFFER = require('./adaptors/looks-same.js');

/**
 * Module for file system interaction
 *
 * @param {FS}
 * @const
 */
var DEFAULT_FS = require('./adaptors/fs.js');

/**
 * Root directory of the screenshots
 *
 * @type {String}
 * @const
 * @default
 */
var DEFAULT_ROOT_DIRECTORY = 'visual-tests';

/**
 * File extension for images
 *
 * @type {String}
 * @const
 * @default
 */
var IMAGE_EXTENSION = '.png';

/**
 * Name extension for baseline image
 *
 * @type {String}
 * @const
 * @default
 */
var BASELINE_NAME = '';

/**
 * Name extension for screenshot
 *
 * @type {String}
 * @const
 * @default
 */
var SCREENSHOT_NAME = '.new';

/**
 * Name extension for diff image
 *
 * @type {String}
 * @const
 * @default
 */
var DIFF_NAME = '.diff';


/**
 * @param {Browser} browser - Instance of some browser
 * @param {Object} [options]
 * @param {Differ} [options.differ] - A diffing tool instance
 * @param {FS} [options.fs] - A module to interact with the file system
 * @param {String} [options.rootDirectory='visual-tests'] - The directory
 *     where the screenshots will be saved
 * @constructor
 */
function Mugshot(browser, options) {
  if (browser === undefined) {
    throw new Error('No browser instance was provided');
  }

  this._browser = browser;

  if (options !== undefined &&
      (typeof options !== 'object' || options instanceof Array)) {
    throw new Error('options is not an obejct');
  }

  options = options || {};
  this._options = {};

  this._options.differ = options.differ || DEFAULT_DIFFER;
  this._options.fs = options.fs || DEFAULT_FS;
  this._options.rootDirectory = options.rootDirectory || DEFAULT_ROOT_DIRECTORY;
}

/**
 * @param {Object} captureItem - Details about what will be captured
 * @param {String} [captureItem.selector] - A html or css selector
 * @param {String} captureItem.name - A name for the screenshot without any
 *    extension
 */
Mugshot.prototype.test = function(captureItem) {
  var fs = this._options.fs,
      browser = this._browser;

  if (captureItem === undefined) {
    throw new Error('You have not provided any selector');
  }

  if (typeof captureItem !== 'object' || captureItem instanceof Array) {
    throw new Error('The provided selector is not an object');
  }

  if (captureItem.name === undefined) {
    throw new Error('Your object has no \'name\' property');
  }

  this._options.getPath = composeImagePath(this._options.rootDirectory,
      captureItem.name);
  var _this = this;

  fs.mkdir(this._options.rootDirectory, function(error) {
    if (error && error.code !== 'EEXIST') {
      throw error;
    }

    browser.takeScreenshot(function(error, screenshot) {
      if (error) {
        throw error;
      }

      _test(_this._options, screenshot);
    });
  });
};

/**
 * Writes the baseline on disk
 *
 * @param {FS} fs - File system adaptor instance
 * @param {String} baselinePath - The path of the baseline on the disk
 * @param {Buffer} baseline - The binary representation of the baseline
 */
function _writeBaseline(fs, baselinePath, baseline) {
  fs.writeFile(baselinePath, baseline, function(error) {
    if (error) {
      throw error;
    }
  });
}

/**
 * Writes the screenshot and the diff on disk
 *
 * @param {FS} fs - File system adaptor instance
 * @param {Object} paths - Contains the path of the screenshot and diff on disk
 * @param {String} paths.screenshotPath
 * @param {String} paths.diffPath
 * @param {Object} data - Contains the binary representation of the screenshot
 *    and the diff
 * @param {Buffer} data.screenshot
 * @param {Buffer} data.diff
 */
function _writeScreenshotAndDiff(fs, paths, data) {
  fs.writeFile(paths.screenshotPath, data.screenshot, function(error) {
    if (error) {
      throw error;
    }
  });

  fs.writeFile(paths.diffPath, data.diff, function(error) {
    if (error) {
      throw error;
    }
  });
}

/**
 * Unlinks from disk the screenshot and the diff image from a previous run
 *
 * @param {FS} fs - File system adaptor instance
 * @param {String} screenshotPath - The path of the screenshot on disk
 * @param {String} diffPath - The path of the diff image on disk
 */
function _unlinkScreenshotAndDiff(fs, screenshotPath, diffPath) {
  fs.unlink(screenshotPath, function(error) {
    if (error && error.code !== 'ENOENT') {
      throw error;
    }
  });

  fs.unlink(diffPath, function(error) {
    if (error && error.code !== 'ENOENT') {
      throw error;
    }
  });
}

/**
 * Actually does the testing
 *
 * @param {Object} options - Same as in test method
 * @param {Buffer} screenshot - Binary representation of the screenshot
 */
function _test(options, screenshot) {
  var fs = options.fs,
      baselinePath = options.getPath(BASELINE_NAME);

  fs.exists(baselinePath, function(exists) {
    if (exists) {
      fs.readFile(baselinePath, function(error, baseline) {
        if (error) {
          throw error;
        }

        _diffImages(options, baseline, screenshot);
      });
    } else {
      _writeBaseline(fs, baselinePath, screenshot);
    }
  });
}

/**
 * Compare the images and if there are differences writes the screenshot and the
 * diff on disk
 *
 * @param {Object} options - Same as in _test method
 * @param {Buffer} baseline - The binary representation of the baseline
 * @param {Buffer} screenshot - The binary representation of the screenshot
 */
function _diffImages(options, baseline, screenshot) {
  var differ = options.differ,
      screenshotPath = options.getPath(SCREENSHOT_NAME),
      diffPath = options.getPath(DIFF_NAME);

  differ.isEqual(baseline, screenshot, function(error, equal) {
    if (error) {
      throw error;
    }

    if (equal) {
      _unlinkScreenshotAndDiff(options.fs, screenshotPath, diffPath);
    } else {
      differ.createDiff(baseline, screenshot, function(error, diff) {
        if (error) {
          throw error;
        }

        var paths = {
          screenshotPath: screenshotPath,
          diffPath: diffPath
        };

        var data = {
          screenshot: screenshot,
          diff: diff
        };

        _writeScreenshotAndDiff(options.fs, paths, data);
      });
    }
  });
}

/**
* Builds the path of an image on disk
*
* @param {String} rootDirectory - Root directory of the screenshots
* @param {String} baseName - A name for the screenshot without extension
*
* @returns {Function} - Actually returns the path of the image
*/
function composeImagePath(rootDirectory, baseName) {
  /**
  * @param {String} - An extension to give more info about the image
  *
  * @returns {String} The path on the disk
  */
  return function(extensionName) {
    var name = baseName + extensionName + IMAGE_EXTENSION;

    return path.join(rootDirectory, name);
  }
}

module.exports = Mugshot;
