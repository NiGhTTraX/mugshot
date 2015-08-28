var expect = require('chai').expect;
var LooksSameAdapter = require('../../../lib/adapters/looks-same.js');
var fs = require('fs');
var path = require('path');

function composePath(file) {
  var ext = '.png';
  return path.join(__dirname, 'data', file + ext);
}

describe('LooksSame Adapter', function() {
  var tall = fs.readFileSync(composePath('tall')),
      wide = fs.readFileSync(composePath('wide')),
      sizes = fs.readFileSync(composePath('sizes'));

  it('should override the default highlightColor', function(done) {
    var options = {
          highlightColor: '#0000FF'
        },
        adapter = new LooksSameAdapter(options);

    adapter.createDiff(tall, wide, function(error, diff) {
      adapter.isEqual(diff, sizes, function(error, equal) {
        expect(error).to.be.null;
        expect(equal).to.be.false;

        done();
      });
    });
  });

  it('should always return a buffer even if the user provides a diff path',
     function(done) {
    var options = {
          diff: 'path'
        },
        adapter = new LooksSameAdapter(options);

    adapter.createDiff(tall, wide, function(error, diff) {
      expect(error).to.be.null;
      expect(diff).to.be.an.instanceof(Buffer);

      done();
    });
  });

  it('should set strict to false if it receives a tolerance', function(done) {
    var options = {
          tolerance: 5,
          strict: true
        },
        adapter = new LooksSameAdapter(options);

    adapter.isEqual(tall, wide, function(error, equal) {
      expect(error).to.be.null;
      expect(equal).to.be.false;

      done();
    });
  });
});
