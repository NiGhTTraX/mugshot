/* eslint-disable no-unused-vars */

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
  },

  /**
   * Get the BoundingRect of an element
   *
   * @param {String} selector
   * @param {getBoundingClientRectCb}
   */
  getBoundingClientRect: function(selector, callback) {
    throw new Error('Your browser adaptor has not implemented ' +
        'the \'getBoundingClientRect\' method');
  }
};

/**
* @callback takeScreenshotCb
* @param error
* @param {Buffer} data
*/

/**
 * @callback getClientBoundingRect
 * @param error
 * @param {Object} rect
 * @param {Object} rect.width
 * @param {Number} rect.height
 * @param {Number} rect.top
 * @param {Number} rect.right
 * @param {Number} rect.bottom
 * @param {Number} rect.left
 */
