var path = require('path');

/**
* Diffing tool instance
* @const
*/
var DEFAULT_DIFFER = require('./adaptors/looks-same.js');

/**
* Module for file system interaction
* @const
*/
var DEFAULT_FS = require('./adaptors/fs.js');

/**
* Root directory of the screenshots
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
* @param {String} captureItem.name - A name for the screenshot without extension
*/
Mugshot.prototype.test = function(captureItem) {
  var fs = this._options.fs,
      browser = this._browser,
      differ = this._options.differ,
      getPath = composeImagePath(this._options.rootDirectory, captureItem.name);

  if (captureItem === undefined) {
    throw new Error('You have not provided any selector');
  }

  if (typeof captureItem !== 'object' || captureItem instanceof Array) {
    throw new Error('The provided selector is not an object');
  }

  if (captureItem.name === undefined) {
    throw new Error('Your object has no \'name\' property');
  }

  fs.mkdir(this._options.rootDirectory, function(error) {
    if (error && error.code !== 'EEXIST') {
      throw error;
    }

    browser.takeScreenshot(function(error, screenshot) {
      if (error) {
        throw error;
      }

      var baselinePath = getPath('');

      fs.exists(baselinePath, function(exists) {
        if (!exists) {
          fs.writeFile(baselinePath, screenshot, function(error) {
            if (error) {
              throw error;
            }
          });
        } else {
          fs.readFile(baselinePath, function(error, baseline) {
            if (error) {
              throw error;
            }

            differ.isEqual(baseline, screenshot, function(error, equal) {
              if (error) {
                throw error;
              }

              if (!equal) {
                differ.createDiff(baseline, screenshot, function(error, diff) {
                  if (error) {
                    throw error;
                  }

                  var diffPath = getPath(DIFF_NAME);

                  fs.writeFile(diffPath, diff, function(error) {
                    if (error) {
                      throw error;
                    }
                  });

                  var screenshotPath = getPath(SCREENSHOT_NAME);

                  fs.writeFile(screenshotPath, screenshot, function(error) {
                    if (error) {
                      throw error;
                    }
                  });
                });
              }
            });
          });
        }
      });
    });
  });
};

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
  * @returns {String} The path on the disk
  */
  return function(extensionName) {
    var name = baseName + extensionName + IMAGE_EXTENSION;

    return path.join(rootDirectory, name);
  }
}

module.exports = Mugshot;
