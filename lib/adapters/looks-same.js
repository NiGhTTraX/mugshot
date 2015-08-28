var Differ = require('../interfaces/differ.js');
var looksSame = require('looks-same');
var objectAssign = require('object-assign');

/**
* LooksSame Adapter for use with Mugshot
*
* It can be used in strict mode that checks every pixel to look the same
* and a tolerance mode which permits an error range, this two options
* cannot be used togheter
*
* Although if you pass both Mugshot will set strict mode to false
*
* [LooksSame options] {@link https://github.com/gemini-testing/looks-same}
*
*
* @implements {Differ}
* @class
*
* @param {Object} [userOptions] - Options for LooksSame
* @param {Boolean} [userOptions.strict] - Verifies every pixels
* @param {Number} [userOptions.tolerance] - Permits an error range
* @param {String} [userOptions.highlightColor] - Color for the different pixels
* @param {Boolean} [userOptions.ignoreCaret] - Ignore caret from inputs boxes
*/
function LooksSameAdapter(userOptions) {
  var options = {
    highlightColor: '#ff00ff',
    strict: true
  };

  this._options = objectAssign(options, userOptions, {diff: undefined});

  if (this._options.tolerance !== undefined) {
    this._options.strict = false;
  }
}

LooksSameAdapter.prototype = objectAssign({}, Differ, {
  isEqual: function(img1, img2, callback) {
    var options = objectAssign({}, this._options);

    looksSame(img1, img2, options, callback);
  },

  createDiff: function(img1, img2, callback) {
    var options = objectAssign({}, this._options, {
      reference: img1,
      current: img2
    });

    looksSame.createDiff(options, callback);
  }
});

module.exports = LooksSameAdapter;
