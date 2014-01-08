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
		this.timeout(10000);

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
			alm.getAlm('10.1371%2Fjournal.pbio.1000242', function(err, result) {
				expect(result).to.be.a('array');
				expect(result).to.have.deep.property('[0].doi');
				expect(result).to.have.deep.property('[0].title');
				expect(result).to.have.deep.property('[0].url');
				expect(result).to.have.deep.property('[0].mendeley');
				expect(result).to.have.deep.property('[0].pmid');
				expect(result).to.have.deep.property('[0].pmcid');
				expect(result).to.have.deep.property('[0].publication_date');

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

		it('should return an array of sources with more detailed altmetric data for the article', function(done) {
			var expectedKeys = [
				'name',
				'display_name',
				'events_url',
				'metrics',
				'update_date'
			];

			alm.getAlm('10.1371%2Fjournal.pbio.1000242', function(err, result) {
				expect(result).to.have.deep.property('[0].sources').that.is.a('array');
				expect(result).to.have.deep.property('[0].sources[0]').that.include.keys(expectedKeys);
				expect(result).to.have.deep.property('[0].sources[0].metrics').to.be.a('object');

				done();
			});
		});

		it('should take an object of options as the second argument', function(done) {
			var options = {
				info: 'summary'
			};

			alm.getAlm('10.1371%2Fjournal.pbio.1000242', options, function(err, result) {
				expect(result).to.exist;
				done();
			});
		});

		it('should have an option for requesting history of altmetrics', function(done) {
			var options = {
				info: 'history'
			};

			alm.getAlm('10.1371%2Fjournal.pbio.1000242', options, function(err, result) {
				expect(result).to.have.deep.property('[0].sources[0].histories');
				expect(result).to.have.deep.property('[0].sources[0].by_day');
				expect(result).to.have.deep.property('[0].sources[0].by_month');
				expect(result).to.have.deep.property('[0].sources[0].by_year');
				done();
			});
		});

		it('should have an option for requesting altmetric events', function(done) {
			var options = {
				info: 'event'
			};

			alm.getAlm('10.1371%2Fjournal.pbio.1000242', options, function(err, result) {
				expect(result).to.have.deep.property('[0].sources[0].events').that.is.a('array');
				done();
			});
		});

		it('should have an option for setting days (after publication) option', function(done) {
			var options = {
				days: '30',
				info: 'history'
			};

			alm.getAlm('10.1371%2Fjournal.pbio.1000242', options, function(err, result) {
				expect(result).to.have.deep.property('[0].sources[1].histories').that.is.a('array');
				expect(result).to.have.deep.property('[0].sources[1].histories').to.have.length(2);
				done();
			});
		});

		it('should have an option for setting days (after publication) option', function(done) {
			var options = {
				months: 2,
				info: 'history'
			};

			alm.getAlm('10.1371%2Fjournal.pbio.1000242', options, function(err, result) {
				expect(result).to.have.deep.property('[0].sources[1].histories').that.is.a('array');
				expect(result).to.have.deep.property('[0].sources[1].histories').to.have.length(2);
				done();
			});
		});

		// Time options: days/months after publication, stats at end of given year
		// Raw output: json/xml/csv
			// The media type is set in the header, e.g. 'Accept: application/json'. Media type negotiation via file extension (e.g. '.json') is not supported
	});
});