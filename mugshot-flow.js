var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Mugshot = require('../lib/mugshot.js');

chai.use(require('sinon-chai'));

describe('Mugshot', function() {
  var browser;
  var mugshot;

  before(function() {
    browser = {
      takeScreenshot: sinon.stub()
    };
    
    mugshot = new Mugshot(browser);
  });

  it('should call the browser to take a screenshot', function() {
    mugshot.capture();
    
    expect(browser.takeScreenshot).have.been.calledOnce;
  });
});
