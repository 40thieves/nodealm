var expect = require('chai').expect
,	config = require('../lib/config')()
,	alm = require('../lib/nodealm')
;

describe('ALM', function() {
	describe('setup', function() {
		it('should load development config', function() {
			expect(config.mode).to.equal('development');
		});

		it('should load api key from config', function() {
			expect(alm.apiKey).to.equal('cjt9z8w52sFZN31sC3Gw');
		});
	});

	describe('#getAlm()', function() {
		it('should take a DOI as the first argument', function() {
			alm.getAlm('10.1371%2Fjournal.pbio.1000242', function(err, result) {
				expect(result).to.be.a('array');
			});
		});

		it('should take an array of DOIs as the first argument', function() {
			alm.getAlm(['10.1371%2Fjournal.pbio.1000242', '10.1371%2Fjournal.pone.0035869'], function(err, result) {
				expect(result).to.be.a('array');
			});
		});

		it('should return an object containing the article\'s metadata', function(done) {
			var expectedKeys = [
				'doi',
				'title',
				'url',
				'mendeley',
				'pmid',
				'pmcid',
				'publication_date'
			];

			alm.getAlm('10.1371%2Fjournal.pbio.1000242', function(err, result) {
				expect(result).to.be.a('array');
				expect(result[0]).to.include.keys(expectedKeys);

				done();
			});

		});

		it('should return an object containing aggregated altmetrics for the article', function(done) {
			alm.getAlm('10.1371%2Fjournal.pbio.1000242', function(err, result) {
				expect(result).to.be.a('array');
				expect(result).to.have.deep.property('[0].views');
				expect(result).to.have.deep.property('[0].shares');
				expect(result).to.have.deep.property('[0].bookmarks');
				expect(result).to.have.deep.property('[0].citations');

				done();
			});
		});

		// it('should return an array of sources with more detailed altmetric data for the article', function() {

		// });

		// it('should take an object of options as the second argument', function() {

		// });

		// it('should have an option for requesting history of altmetrics', function() {

		// });

		// it('should have an option for requesting altmetric events', function() {

		// });

		// Time options: days/months after publication, stats at end of given year
		// Raw output: json/xml/csv
			// The media type is set in the header, e.g. 'Accept: application/json'. Media type negotiation via file extension (e.g. '.json') is not supported
	});
});