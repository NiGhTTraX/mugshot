var fs = require('fs');
var helper = require('../helper.js');
var FS = require('../interfaces/fs-interface.js');

helper.extend(module.exports, FS);

/**
* FS Adaptor for file system management
*
* @implements {FS}
*/
module.exports = {

  exists: fs.exists,

  readFile: fs.readFile,

  writeFile: fs.writeFile
};
