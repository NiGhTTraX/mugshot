var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../lib/mugshot.js');

chai.use(require('sinon-chai'));

describe('Mugshot browser interaction', function() {
  var browser;

  before(function() {
    browser = {
      takeScreenshot: sinon.stub()
    };
    var mugshot = new Mugshot(browser);
  });

  describe('takeScreenshot method', function() {
    it('should be called exactly one time', function() {
      expect(browser.takeScreenshot).have.been.calledOnce;
    });
  });
});
