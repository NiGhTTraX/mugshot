var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

function composePath(file) {
  var ext = '.png';
  return path.join(__dirname, 'data', file + ext);
}

function differTests(getDifferInstance) {
  var differInstance,
      same = fs.readFileSync(composePath('same')),
      different = fs.readFileSync(composePath('different')),
      unnoticeable = fs.readFileSync(composePath('different-unnoticeable')),
      tall = fs.readFileSync(composePath('tall')),
      wide = fs.readFileSync(composePath('wide')),
      strict = fs.readFileSync(composePath('strict')),
      strictUnnoticeable = fs.readFileSync(composePath('strict-unnoticeable')),
      sizes = fs.readFileSync(composePath('sizes'));

  beforeEach(function() {
    differInstance = getDifferInstance();
  });

  describe('isEqual method', function() {
    it('should return true for exactly same image', function(done) {

      differInstance.isEqual(same, same, function(error, equal) {
        expect(error).to.be.null;
        expect(equal).to.be.true;

        done();
      });
    });

    it('should return false for different images', function(done) {

      differInstance.isEqual(same, different, function(error, equal) {
        expect(error).to.be.null;
        expect(equal).to.be.false;

        done();
      });
    });

    it('should also return false if differences are unnoticeable',
        function(done) {

          differInstance.isEqual(same, unnoticeable, function(error, equal) {
            expect(error).to.be.null;
            expect(equal).to.be.false;

            done();
          });
        }
    );

    it('should return false for images of different sizes', function(done) {

      differInstance.isEqual(tall, wide, function(error, equal) {
        expect(error).to.be.null;
        expect(equal).to.be.false;

        done();
      });
    });
  });

  describe('createDiff method', function() {
    it('should create a diff between 2 different images', function(done) {

      differInstance.createDiff(same, different, function(error, data) {
        expect(error).to.be.null;

        differInstance.isEqual(strict, data, function(error, equal) {
          expect(error).to.be.null;
          expect(equal).to.be.equal(true);
          done();
        });
      });
    });

    it('should also create a proper diff if the differences are unnoticeable',
        function(done) {

          differInstance.createDiff(same, unnoticeable, function(error, data) {
            expect(error).to.be.null;

            differInstance.isEqual(strictUnnoticeable, data,
                function(error, equal) {
                  expect(error).to.be.null;
                  expect(equal).to.be.equal(true);

                  done();
                });
          });
        });

    it('should create a diff for images of different sizes', function(done) {

      differInstance.createDiff(tall, wide, function(error, data) {
        expect(error).to.be.null;

        differInstance.isEqual(sizes, data, function(error, equal) {
          expect(error).to.be.null;
          expect(equal).to.be.equal(true);

          done();
        });
      });
    });
  });
}

module.exports = differTests;
