var looksSame = require('looks-same');

module.exports = {

  /**
  * Verifies if two images look exactly the same
  *
  * @param {String|Buffer} img1 - A path or a binary representation
  * @param {String|Buffer} img2 - A path or a binary representation
  * @param {equalCb} callback
  */
  isEqual: function(img1, img2, callback) {
    var options = {
      strict: true
    };

    looksSame(img1, img2, options, callback);
  },

  /**
  * Creates the diff image between two photos
  *
  * @param {String|Buffer} img1 - A path or a binary representation
  * @param {String|Buffer} img2 - A path or a binary representation
  * @param {createDiffCb} callback
  */
  createDiff: function(img1, img2, callback) {
    var options = {
      reference: img1,
      current: img2,
      highlightColor: '#ff00ff',
      strict: true,
      save: false
    };

    looksSame.createDiff(options, function(error, buffer) {
      if (error) {
        return callback(error, null);
      }
      callback(null, buffer.toString('base64'));
    });
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
* @param {String} base64
*/
