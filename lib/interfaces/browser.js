/**
* Interface for adaptors that will manage web pages
*
* @interface Browser
*/
module.exports = {
  /**
  * Takes a screenshot of the whole document
  *
  * @param {takeScreenshotCb} callback
  */
  takeScreenshot: function(callback) {
    throw new Error('Your browser adaptor has not implemented ' +
      'the \'exists\' method');
  }
};

/*
* @callback takeScreenshotCb
* @param error
* @param {Buffer} data
*/
