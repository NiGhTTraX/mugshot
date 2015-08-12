var PNGProcessor = require('../interfaces/png-processor.js');
var PNGCrop = require('png-crop');
var concat = require('concat-stream');
var objectAssign = require('object-assign');

/**
 * PNGProcessor adaptor to work with PNG images
 *
 * @implements {PNGProcessor}
 */
module.exports = objectAssign({}, PNGProcessor, {
  crop: function(img, rect, callback) {
    PNGCrop.cropToStream(img, rect, function(error, stream) {
      if (error) {
        return callback(error);
      }

      stream.pipe(concat(function(data) {
        callback(null, data);
      }));

      stream.on('error', function(error) {
        callback(error);
      });
    });
  }
});
