var expect = require('chai').expect;
var Mugshot = require('../lib/mugshot.js');

describe('Mugshot constructor', function() {

	var dummyBrowser = 'anything';

	it('shoould throw an error if no browser instance is provided', function() {
		expect(Mugshot).to.throw(Error);
	});

	it('should throw an error if options is not an object', function() {

		expect(Mugshot.bind({}, dummyBrowser, [])).to.throw(Error);
		expect(Mugshot.bind({}, dummyBrowser, '')).to.throw(Error);
		expect(Mugshot.bind({}, dummyBrowser, 3)).to.throw(Error);
		expect(Mugshot.bind({}, dummyBrowser, function() {})).to.throw(Error);
		expect(Mugshot.bind({}, dummyBrowser, undefined)).to.throw(Error);

	});

	it('should not throw an error if options is not provided', function() {

		expect(Mugshot.bind({}, dummyBrowser)).to.not.throw(Error);
	});

	it('should not throw an error if options is an object', function() {
		expect(Mugshot.bind({}, dummyBrowser, {})).to.not.throw(Error);
	});

});
