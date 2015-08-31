/* eslint-disable no-unused-vars */

/**
* Interface for adaptors that will compare images
*
* @interface Differ
*/
module.exports = {
  /**
  * Verifies if two images look exactly the same
  *
  * @param {Buffer} img1
  * @param {Buffer} img2
  * @param {isEqualCb} callback
  */
  isEqual: function(img1, img2, callback) {
    throw new Error('Your differ adaptor has not implemented the ' +
      '\'isEqual\' method');
  },

  /**
  * Creates the diff image between two photos
  *
  * @param {Buffer} img1
  * @param {Buffer} img2
  * @param {createDiffCb} callback
  */
  createDiff: function(img1, img2, callback) {
    throw new Error('Your differ adaptor has not implemented the ' +
      '\'createDiff\' method');
  }
};

/**
* @callback isEqualCb
* @param error
* @param {Boolean} equal - True if there are no differences otherwise false
*/

/**
* @callback createDiffCb
* @param error
* @param {Buffer} data - The binary representation of the diff image
*/
