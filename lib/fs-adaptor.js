var fs = require('fs');


module.exports = {

  /**
  * Verifies if a file is on the disk
  *
  * @param {String} path
  * @param {fsAdaptor~existsCb} callback
  */
  exists: fs.exists,

  /**
  * Reads a file from the disk
  *
  * @param {String} path
  * @param {fsAdaptor~readCb} callback
  */
  readFile: function(path, callback) {
    var options = {
      encoding: 'base64'
    };

    fs.readFile(path, data, options, callback);
  },

  /**
  * Writes the file on the disk
  *
  * @param {String} path
  * @param {String|Buffer} data
  * @param {fsAdaptor~writeCb) callback
  */
  writeFile: function(path, data, callback) {
    var options = {
      encoding: 'base64'
    };

    fs.writeFile(path, data, options, callback);
  }
};

/**
* @callback existsCb
* @param {Boolean} exists
*/

/**
* @callback readCb
* @param error
* @param {String|Buffer} data
*/

/**
* @callback writeCb
* @param error
*/
