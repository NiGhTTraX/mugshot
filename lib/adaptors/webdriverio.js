var Browser = require('../interfaces/browser.js');
var objectAssign = require('object-assign');

function WebDriverIOAdaptor(webdriverioInstance) {
  this._webdriverio = webdriverioInstance;
}

WebDriverIOAdaptor.prototype = objectAssign({}, Browser, {
  takeScreenshot: function() {
    this._webdriverio.saveScreenshot();
  }
});



