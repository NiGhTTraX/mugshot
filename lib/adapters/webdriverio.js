var Browser = require('../interfaces/browser.js');
var objectAssign = require('object-assign');

/**
 * An adapter of WebdriverIO for use with Mugshot
 *
 * @implements {Browser}
 * @class
 *
 * @param webdriverioInstance - An instance of WebdriverIO
 */
function WebDriverIOAdaptor(webdriverioInstance) {
  this._webdriverio = webdriverioInstance;
}

WebDriverIOAdaptor.prototype = objectAssign({}, Browser, {
  takeScreenshot: function(callback) {
    this._webdriverio.saveScreenshot()
        .then(function(screenshot) {
          callback(null, screenshot);
        });
  },

  getBoundingClientRect: function(selector, callback) {
    var webdriverio = this._webdriverio;

    webdriverio.getElementSize(selector, function(error, size) {
      if (error) {
        return callback(error);
      }

      webdriverio.getLocation(selector, function(error, location) {
        if (error) {
          return callback(error);
        }

        var rect = {
          width: size.width,
          height: size.height,
          top: location.y,
          left: location.x,
          bottom: location.y + size.height,
          right: location.x + size.width
        };

        callback(null, rect);
      });
    });
  }
});

module.exports = WebDriverIOAdaptor;
