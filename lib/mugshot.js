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

  if (arguments.length >= 2 &&
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

  browser.takeScreenshot(function(error, screenshot) {

    fs.exists(captureItem.name, function(exists) {
      if (!exists) {
        var baselinePath = getPath('');
        fs.writeFile(baselinePath, screenshot, function(error) {

        });
      }
      else {
        fs.readFile(captureItem.name, function(error, baseline) {

          differ.isEqual(baseline, screenshot, function(error, equal) {
            if (!equal) {
              differ.createDiff(baseline, screenshot, function(error, diff) {
                var diffPath = getPath(DIFF_NAME);
                fs.writeFile(diffPath, diff, function(error) {

                });

                var screenshotPath = getPath(SCREENSHOT_NAME);
                fs.writeFile(screenshotPath, screenshot, function(error) {

                });
              });
            }
          });
        });
      }
    });
  });
};

/**
* Builds the path of an image on disk
*
* @param {String} rootDirectory - Root directory of the screenshots
* @param {String} baseName - A name for the screenshot without extension
* @returns {Function}
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
