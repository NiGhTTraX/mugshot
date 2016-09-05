var fs = require('fs');
var FS = require('../interfaces/fs.js');
var mkdirp = require('mkdirp');
var objectAssign = require('object-assign');

/**
* FS Adapter for file system management using node file system
*
* @implements {FS}
*/
module.exports = objectAssign({}, FS, {
  exists: fs.exists,

  readFile: fs.readFile,

  writeFile: fs.writeFile,

  mkdir: mkdirp,

  unlink: fs.unlink
});
