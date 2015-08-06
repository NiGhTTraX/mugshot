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
  * @param {equalCb} callback
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
* @callback equalCb
* @param error
* @param {Boolean} equal
*/

/**
* @callback createDiffCb
* @param error
* @param {Buffer} data
*/
