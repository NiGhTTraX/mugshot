var Differ = require('./interfaces/differ.js');
var looksSame = require('looks-same');

/**
* LooksSame Adaptor for use with Mugshot
*
* @class
* @implements {Differ}
*/
function LooksSameAdaptor() {}

LooksSameAdaptor.prototype = Differ;

LooksSameAdaptor.prototype.isEqual = function(img1, img2, callback) {
  var options = {
    strict: true
  };

  looksSame(img1, img2, options, callback);
};

LooksSameAdaptor.prototype.createDiff = function(img1, img2, callback) {
  var options = {
    reference: img1,
    current: img2,
    highlightColor: '#ff00ff',
    strict: true,
    save: false
  };

  looksSame.createDiff(options, callback);
}

module.exports = LooksSameAdaptor;
