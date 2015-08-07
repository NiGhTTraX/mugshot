var Browser = require('../interfaces/browser.js');
var objectAssign = require('object-assign');

function WebDriverIOAdaptor(webdriverioInstance) {
  this._webdriverio = webdriverioInstance;
}

WebDriverIOAdaptor.prototype = objectAssign({}, Browser, {
  takeScreenshot: function(callback) {
    this._webdriverio.saveScreenshot(callback);
  }
});

module.exports = WebDriverIOAdaptor;



