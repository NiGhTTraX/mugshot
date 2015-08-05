var expect = require('chai').expect;
var path = require('path');
var looksSameAdaptor = require('../lib/looks-same-adaptor.js');

function composePath(file) {
  return path.join(__dirname, '/data/looks-same/', file);
}

describe('looks-same adaptor', function() {
  describe('isEqual method', function() {
    it('should return true for exactly same image', function(done) {
      var img1 = composePath('same.png');

      looksSameAdaptor.isEqual(img1, img1, function(error, equal) {
        expect(error).to.be.null;
        expect(equal).to.be.true;
        done();
      });
    });

    it('should return false for different images', function(done) {
      var img1 = composePath('same.png');
      var img2 = composePath('different.png');

      looksSameAdaptor.isEqual(img1, img2, function(error, equal) {
        expect(error).to.be.null;
        expect(equal).to.be.false;
        done();
      });
    });

    it('should also return false if differences are unnoticeable', function(done) {
      var img1 = composePath('same.png');
      var img2 = composePath('different-unnoticeable.png');

      looksSameAdaptor.isEqual(img1, img2, function(error, equal) {
        expect(error).to.be.null;
        expect(equal).to.be.false;
        done();
      });
    })

    it('should return false for images of different sizes', function(done) {
      var img1 = composePath('wide.png');
      var img2 = composePath('tall.png');

      looksSameAdaptor.isEqual(img1, img2, function(error, equal) {
        expect(error).to.be.null;
        expect(equal).to.be.false;
        done();
      });
    });
  });

  describe('createDiff method', function() {
    it('should create a diff between 2 different images', function(done) {
      var img1 = composePath('same.png');
      var img2 = composePath('different.png');
      var diff = composePath('strict.png');

      looksSameAdaptor.createDiff(img1, img2, function(error, base64) {
        var buffer = new Buffer(base64, 'base64');
        expect(error).to.be.null;

        looksSameAdaptor.isEqual(diff, buffer, function(error, equal) {
          expect(error).to.be.null;
          expect(equal).to.be.equal(true);
          done();
        });
      });
    });

    it('should also create a proper diff if the differences are unnoticeable',
      function(done) {
        var img1 = composePath('same.png');
        var img2 = composePath('different-unnoticeable.png');
        var diff = composePath('strict-unnoticeable.png');

        looksSameAdaptor.createDiff(img1, img2, function(error, base64) {
          var buffer = new Buffer(base64, 'base64');
          expect(error).to.be.null;

          looksSameAdaptor.isEqual(diff, buffer, function(error, equal) {
            expect(error).to.be.null;
            expect(equal).to.be.equal(true);
            done();
          });
        });
      }
    );

    it('should create a diff for images of different sizes', function(done) {
      var img1 = composePath('tall.png');
      var img2 = composePath('wide.png');
      var diff = composePath('sizes.png');

      looksSameAdaptor.createDiff(img1, img2, function(error, base64) {
        var buffer = new Buffer(base64, 'base64');
        expect(error).to.be.null;

        looksSameAdaptor.isEqual(diff, buffer, function(error, equal) {
          expect(error).to.be.null;
          expect(equal).to.be.equal(true);
          done();
        });
      });
    });
  });
});
