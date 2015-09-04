var path = require('path');
var objectAssign = require('object-assign');
var LooksSameAdapter = require('./adapters/looks-same.js');

/**
 * Diffing tool instance
 *
 * @type {Differ}
 * @const
 */
var DEFAULT_DIFFER = new LooksSameAdapter();

/**
 * Module for file system interaction
 *
 * @type {FS}
 * @const
 */
var DEFAULT_FS = require('./adapters/fs.js');

/**
 * Module for PNG manipulation
 *
 * @type {PNGProcessor}
 * @const
 */
var DEFAULT_PNGPROCESSOR = require('./adapters/png-crop.js');

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

  var defaultOptions = {
    differ: DEFAULT_DIFFER,
    fs: DEFAULT_FS,
    PNGProcessor: DEFAULT_PNGPROCESSOR,
    rootDirectory: DEFAULT_ROOT_DIRECTORY
  };

  this._options = objectAssign({}, defaultOptions, options);
}

/**
 * @param {Object} captureItem - Details about what will be captured
 * @param {String} [captureItem.selector] - A html or css selector
 * @param {String} captureItem.name - A name for the screenshot without any
 *    extension
 * @param {testCb} callback
 */
Mugshot.prototype.test = function(captureItem, callback) {
  var fs = this._options.fs,
      browser = this._browser,
      options = this._options;

  if (captureItem === undefined) {
    throw new Error('You have not provided any selector');
  }

  if (callback === undefined || typeof callback !== 'function') {
    throw new Error('You have not provided a callback');
  }

  if (typeof captureItem !== 'object' || captureItem instanceof Array) {
    throw new Error('The provided selector is not an object');
  }

  if (captureItem.name === undefined) {
    throw new Error('Your object has no \'name\' property');
  }

  fs.mkdir(this._options.rootDirectory, function(error) {
    if (error && error.code !== 'EEXIST') {
      return callback(error);
    }

    browser.takeScreenshot(function(error, screenshot) {
      if (error) {
        return callback(error);
      }

      _processScreenshot(captureItem, browser, options, screenshot, callback);
    });
  });
};

/**
 * @callback testCb
 * @param error
 * @param {Boolean} result
 */

/**
 * Writes the screenshot and the diff on disk
 *
 * @param {FS} fs - File system adapter instance
 * @param {Object} paths - Contains the path of the screenshot and diff on disk
 * @param {String} paths.screenshotPath
 * @param {String} paths.diffPath
 * @param {Object} data - Contains the binary representation of the screenshot
 *    and the diff
 * @param {Buffer} data.screenshot
 * @param {Buffer} data.diff
 * @param {testCb} done - Called when all operations have finished
 */
function _writeScreenshotAndDiff(fs, paths, data, done) {
  fs.writeFile(paths.screenshotPath, data.screenshot, function(error) {
    if (error) {
      return done(error);
    }

    fs.writeFile(paths.diffPath, data.diff, function(error) {
      if (error) {
        return done(error);
      }

      done(null, false);
    });
  });
}

/**
 * Unlinks from disk the screenshot and the diff image from a previous run
 *
 * @param {FS} fs - File system adapter instance
 * @param {Object} paths - Paths of the images
 * @param {String} paths.baselinePath - The path of the baseline on disk
 * @param {String} paths.screenshotPath - The path of the screenshot on disk
 * @param {String} paths.diffPath - The path of the diff image on disk
 * @param {testCb} done - Called when all operations have finished
 */
function _unlinkScreenshotAndDiff(fs, paths, done) {
  fs.unlink(paths.screenshotPath, function(error) {
    if (error && error.code !== 'ENOENT') {
      return done(error);
    }

    fs.unlink(paths.diffPath, function(error) {
      if (error && error.code !== 'ENOENT') {
        return done(error);
      }

      done(null, true);
    });
  });
}

/**
 * Process the screenshot before testing
 *
 * @param {Object} captureItem - Same as in test method
 * @param {Browser} browser - A browser adapter instance
 * @param {Object} options - Same as in test method
 * @param {Buffer} screenshot - The binary representation of the whole web page
 * @param {testCb} done - Called when all operations have finished
 */
function _processScreenshot(captureItem, browser, options, screenshot, done) {
  var PNGProcessor = options.PNGProcessor;

  if (captureItem.selector === undefined) {
    _test(captureItem.name, options, screenshot, done);
  } else {
    browser.getBoundingClientRect(captureItem.selector, function(error, rect) {
      if (error) {
        return done(error);
      }

      PNGProcessor.crop(screenshot, rect, function(error, croppedImage) {
        if (error) {
          return done(error);
        }

        _test(captureItem.name, options, croppedImage, done);
      });
    });
  }
}

/**
 * Actually does the testing
 *
 * @param {Object} options - Same as in test processScreenshot method
 * @param {Buffer} screenshot - Binary representation of the screenshot
 * @param {testCb} done - Called when all operations have finished
 */
function _test(baseName, options, screenshot, done) {
  options.getPath = composeImagePath(options.rootDirectory, baseName);

  var fs = options.fs,
      baselinePath = options.getPath(BASELINE_NAME);

  fs.exists(baselinePath, function(exists) {
    if (exists) {
      fs.readFile(baselinePath, function(error, baseline) {
        if (error) {
          return done(error);
        }

        _diffImages(options, baseline, screenshot, done);
      });
    } else {
      fs.writeFile(baselinePath, screenshot, function(error) {
        if (error) {
          return done(error);
        }

        done(null, {
          isEqual: true,
          baseline: baselinePath
        });
      });
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
 * @param {testCb} done - Called when all operations have finished
 */
function _diffImages(options, baseline, screenshot, done) {
  var differ = options.differ,
      screenshotPath = options.getPath(SCREENSHOT_NAME),
      diffPath = options.getPath(DIFF_NAME);

  differ.isEqual(baseline, screenshot, function(error, equal) {
    if (error) {
      return done(error);
    }

    if (equal) {
      var paths = {
        baselinePath: options.getPath(BASELINE_NAME),
        screenshotPath: screenshotPath,
        diffPath: diffPath
      };

      _unlinkScreenshotAndDiff(options.fs, paths, done);
    } else {
      differ.createDiff(baseline, screenshot, function(error, diff) {
        if (error) {
          return done(error);
        }

        var paths = {
          screenshotPath: screenshotPath,
          diffPath: diffPath
        };

        var data = {
          screenshot: screenshot,
          diff: diff
        };

        _writeScreenshotAndDiff(options.fs, paths, data, done);
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
* @returns {buildPath} - Actually returns the path of the image
*/
function composeImagePath(rootDirectory, baseName) {
  /**
  * Builds the path for the images on disk
  *
  * @name buildPath
  * @function
  * @param {String} - An extension to give more info about the image
  *
  * @returns {String} - The image path on the disk
  */
  return function(extensionName) {
    var name = baseName + extensionName + IMAGE_EXTENSION;

    return path.join(process.cwd(), rootDirectory, name);
  }
}

module.exports = Mugshot;
