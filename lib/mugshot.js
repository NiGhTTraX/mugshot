/**
* Diffing tool instance
* @const
*/
var DEFAULT_DIFFER = require('.adaptors/looks-same.js');

/**
* Module for file system interaction
* @const
*/
var DEFAULT_FS = require('.adaptors/fs.js');

/**
* Root directory of the screenshots
* @type {String}
* @const
* @default
*/
var DEFAULT_ROOT_DIRECTORY = 'visual-tests';

/**
* @param browser - Instance of some browser
* @param {Object} [options]
* @param [options.differ] - A diffing tool instance
* @param [options.fs] - A module to interact with the file system
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
* @param {String} caputreItem.name - A name for the screenshot
*/
Mugshot.prototype.test = function(captureItem) {
  var fs = this._options.fs,
      browser = this._browser,
      differ = this._options.differ;

  browser.takeScreenshot(function(error, screenshot) {

    fs.exists(captureItem.name, function(error, exists) {
      if (!exists) {
        fs.writeFile(captureItem.name, screenshot, function(error) {

        });
      }
      else {
        fs.readFile(captureItem.name, function(error, baseline) {

          differ.isEqual(baseline, screenshot, function(error, equal) {
            if (!equal) {
              differ.createDiff(baseline, screenshot, function(error, diff) {
                var diffName = captureItem.name + '.diff.png';
                fs.writeFile(diffName, diff, function(error) {

                });

                var screenshotName = captureItem.name + '.new.png';
                fs.writeFile(screenshotName, screenshot, function(error) {

                });
              });
            }
          });
        });
      }
    });
  });
};

module.exports = Mugshot;
