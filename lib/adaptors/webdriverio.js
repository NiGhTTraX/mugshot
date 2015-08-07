var Browser = require('../interfaces/browser.js');
var webdriverio = require('webdriverio');
var objectAssign = require('object-assign');

module.exports = objectAssign({}, Browser, {
  takeScreenshot: webdriverio.takeScreenshot
});
