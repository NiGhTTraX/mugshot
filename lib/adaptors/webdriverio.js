var Browser = require('../interfaces/browser.js');
var objectAssign = require('object-assign');

function WebDriverIOAdaptor(webdriverioInstance) {
  this._webdriverio = webdriverioInstance;
}

WebDriverIOAdaptor.prototype = objectAssign({}, Browser, {
  takeScreenshot: function(callback) {
    this._webdriverio.saveScreenshot(callback);
  },

  getBoundingClientRect: function(selector, callback) {
    this._webdriverio.getElementSize(selector, function(error, size) {
      if (error) {
        return callback(error);
      }

      this._webdriverio.getLocation(selector, function(error, location) {
        if (error) {
          return callback(error);
        }

        var rect = {};

        rect.width = size.width;
        rect.height = size.height;
        rect.top = location.y;
        rect.left = location.x;
        rect.bottom = rect.y + rect.height;
        rect.right = rect.x + rect.width;

        callback(null, rect);
      });
    });
  }
});

module.exports = WebDriverIOAdaptor;
