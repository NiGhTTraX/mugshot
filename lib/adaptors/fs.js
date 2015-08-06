var fs = require('fs');
var FS = require('../interfaces/fs.js');
var objectAssign = require('object-assign');

/**
* FS Adaptor for file system management using node file system
*
* @implements {FS}
*/
module.exports = objectAssign({}, FS, {
  exists: fs.exists,

  readFile: fs.readFile,

  writeFile: fs.writeFile
});
