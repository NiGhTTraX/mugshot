/**
* A module with helper function
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
