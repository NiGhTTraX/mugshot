/**
* Diffing tool instance
* @const
*/
var DEFAULT_DIFFER = require('looks-same');

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
  this._options.rootDirectory = options.rootDirectory || DEFAULT_ROOT_DIRECTORY;
}

Mugshot.prototype.capture = function() {
  var base64Image = this._browser.takeScreenshot();
}

module.exports = Mugshot;
