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
