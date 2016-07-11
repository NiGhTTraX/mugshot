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
        })
        .catch(function(error) {
          callback(error);
        });
  },

  getBoundingClientRect: function(selector, callback) {
    var webdriverio = this._webdriverio;
    webdriverio.getElementSize(selector)
        .then(function(size) {

          if (size instanceof Array) {
            throw new Error('The selector ' + selector + ' is not unique.');
          }

          webdriverio.getLocation(selector)
              .then(function(location) {

                var rect = {
                  width: size.width,
                  height: size.height,
                  top: location.y,
                  left: location.x,
                  bottom: location.y + size.height,
                  right: location.x + size.width
                };

                callback(null, rect);
              })
              .catch(function(error) {
                callback(error);
              });
        })
        .catch(function(error) {
          callback(error);
        });
  }
});

module.exports = WebDriverIOAdaptor;
