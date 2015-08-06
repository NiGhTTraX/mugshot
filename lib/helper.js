/**
* A module with helper functions
*/
module.exports = {
  /**
  *
  */
  extend: function(destination, source) {
    for (var property in source) {
      destination[property] = source[property];
    }
  }
};
