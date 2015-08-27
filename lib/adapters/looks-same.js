var Differ = require('../interfaces/differ.js');
var looksSame = require('looks-same');
var objectAssign = require('object-assign');

/**
* LooksSame Adapter for use with Mugshot
*
* @implements {Differ}
* @class
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
    looksSame(img1, img2, this._options, callback);
  },

  createDiff: function(img1, img2, callback) {
    this._options.reference = img1;
    this._options.current = img2;

    looksSame.createDiff(this._options, callback);
  }
});

module.exports = LooksSameAdapter;
