var expect = require('chai').expect;
var path = require('path');

function composePath(file) {
  return path.join(__dirname, 'data', 'looks-same', file);
}

function differTests(getDifferInstance) {
  var differInstance;

  beforeEach(function() {
    differInstance = getDifferInstance();
  });

  describe('isEqual method', function() {
    it('should return true for exactly same image', function(done) {
      var img1 = composePath('same.png');

      differInstance.isEqual(img1, img1, function(error, equal) {
        expect(error).to.be.null;
        expect(equal).to.be.true;
        done();
      });
    });

    it('should return false for different images', function(done) {
      var img1 = composePath('same.png');
      var img2 = composePath('different.png');

      differInstance.isEqual(img1, img2, function(error, equal) {
        expect(error).to.be.null;
        expect(equal).to.be.false;
        done();
      });
    });

    it('should also return false if differences are unnoticeable', function(done) {
      var img1 = composePath('same.png');
      var img2 = composePath('different-unnoticeable.png');

      differInstance.isEqual(img1, img2, function(error, equal) {
        expect(error).to.be.null;
        expect(equal).to.be.false;
        done();
      });
    })

    it('should return false for images of different sizes', function(done) {
      var img1 = composePath('wide.png');
      var img2 = composePath('tall.png');

      differInstance.isEqual(img1, img2, function(error, equal) {
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

      differInstance.createDiff(img1, img2, function(error, data) {
        expect(error).to.be.null;

        differInstance.isEqual(diff, data, function(error, equal) {
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

        differInstance.createDiff(img1, img2, function(error, data) {
          expect(error).to.be.null;

          differInstance.isEqual(diff, data, function(error, equal) {
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

      differInstance.createDiff(img1, img2, function(error, data) {
        expect(error).to.be.null;

        differInstance.isEqual(diff, data, function(error, equal) {
          expect(error).to.be.null;
          expect(equal).to.be.equal(true);
          done();
        });
      });
    });
  });
}

module.exports = differTests;
