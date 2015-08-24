var Differ = require('../interfaces/differ.js');
var looksSame = require('looks-same');
var objectAssign = require('object-assign');

/**
* LooksSame Adapter for use with Mugshot
*
* @implements {Differ}
*/
module.exports = objectAssign({}, Differ, {

  isEqual: function(img1, img2, callback) {
    var options = {
      strict: true
    };

    looksSame(img1, img2, options, callback);
  },

  createDiff: function(img1, img2, callback) {
    var options = {
      reference: img1,
      current: img2,
      highlightColor: '#ff00ff',
      strict: true,
      save: false
    };

    looksSame.createDiff(options, callback);
  }
});
