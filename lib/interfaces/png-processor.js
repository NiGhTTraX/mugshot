/* eslint-disable no-unused-vars */

/**
 * Interface for adaptors that will manipulate PNG images
 *
 * @interface PNGProcessor
 */
module.exports = {
  /**
   * Crops the specified area
   *
   * @param {Buffer} img
   * @param {Object} rect
   * @param {Number} rect.width
   * @param {Number} rect.height
   * @param {Number} rect.top
   * @param {Number} rect.left
   * @param {Number} rect.bottom
   * @param {Number} rect.right
   * @param {cropCb} callback
   */
  crop: function(img, rect, callback) {
    throw new Error('Your PNGProcessor has not implemented ' +
        'the \'crop\' method');
  }
};

/**
 * @callback cropCb
 * @param error
 * @param {Buffer} croppedImg - The binary representation of the cropped image
 */
