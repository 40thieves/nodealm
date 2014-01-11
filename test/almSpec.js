var expect = require('chai').expect
,	config = require('../lib/config')()
,	apiKey = require('../lib/config/apiKey')
,	alm = require('../lib/nodeAlm')
;

describe('ALM', function() {
	describe('setup', function() {
		it('should load development config', function() {
			expect(config.mode).to.equal('development');
		});

		it('should load api key from config', function() {
			expect(alm.apiKey).to.equal(apiKey);
		});
	});

	describe('#getAlm()', function() {
		this.timeout(10000);

		it('should take a DOI as the first argument', function(done) {
			alm.getAlm('10.1371/journal.pbio.1000242', function(err, result) {
				expect(result).to.be.a('object');

				done();
			});
		});

		it('should take an array of DOIs as the first argument', function(done) {
			alm.getAlm(['10.1371/journal.pbio.1000242', '10.1371/journal.pone.0035869'], function(err, result) {
				expect(result).to.be.a('array');

				done();
			});
		});

		it('should return an object containing the article\'s metadata', function(done) {
			alm.getAlm('10.1371/journal.pbio.1000242', function(err, result) {
				expect(result).to.have.deep.property('doi');
				expect(result).to.have.deep.property('title');
				expect(result).to.have.deep.property('url');
				expect(result).to.have.deep.property('mendeley');
				expect(result).to.have.deep.property('pmid');
				expect(result).to.have.deep.property('pmcid');
				expect(result).to.have.deep.property('publication_date');

				done();
			});

		});

		it('should return an object containing aggregated altmetrics for the article', function(done) {
			alm.getAlm('10.1371/journal.pbio.1000242', function(err, result) {
				expect(result).to.have.deep.property('views');
				expect(result).to.have.deep.property('shares');
				expect(result).to.have.deep.property('bookmarks');
				expect(result).to.have.deep.property('citations');

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

			alm.getAlm('10.1371/journal.pbio.1000242', function(err, result) {
				expect(result).to.have.deep.property('sources').that.is.a('array');
				expect(result).to.have.deep.property('sources[0]').that.include.keys(expectedKeys);
				expect(result).to.have.deep.property('sources[0].metrics').to.be.a('object');

				done();
			});
		});

		it('should take an object of options as the second argument', function(done) {
			var options = {
				info: 'summary'
			};

			alm.getAlm('10.1371/journal.pbio.1000242', options, function(err, result) {
				expect(result).to.exist;
				done();
			});
		});

		it('should have an option for requesting history of altmetrics', function(done) {
			var options = {
				info: 'history'
			};

			alm.getAlm('10.1371/journal.pbio.1000242', options, function(err, result) {
				expect(result).to.have.deep.property('sources[0].histories');
				expect(result).to.have.deep.property('sources[0].by_day');
				expect(result).to.have.deep.property('sources[0].by_month');
				expect(result).to.have.deep.property('sources[0].by_year');
				done();
			});
		});

		it('should have an option for requesting altmetric events', function(done) {
			var options = {
				info: 'event'
			};

			alm.getAlm('10.1371/journal.pbio.1000242', options, function(err, result) {
				expect(result).to.have.deep.property('sources[0].events').that.is.a('array');
				done();
			});
		});

		it('should have an option for setting days (after publication) option', function(done) {
			var options = {
				days: '30',
				info: 'history'
			};

			alm.getAlm('10.1371/journal.pbio.1000242', options, function(err, result) {
				expect(result).to.have.deep.property('sources[1].histories').that.is.a('array');
				expect(result).to.have.deep.property('sources[1].histories').to.have.length(2);
				done();
			});
		});

		it('should have an option for setting days (after publication) option', function(done) {
			var options = {
				months: 2,
				info: 'history'
			};

			alm.getAlm('10.1371/journal.pbio.1000242', options, function(err, result) {
				expect(result).to.have.deep.property('sources[1].histories').that.is.a('array');
				expect(result).to.have.deep.property('sources[1].histories').to.have.length(2);
				done();
			});
		});

		it('should have an option for setting days (after publication) option', function(done) {
			var options = {
				year: 2010,
				info: 'history'
			};

			alm.getAlm('10.1371/journal.pbio.1000242', options, function(err, result) {
				expect(result).to.have.deep.property('sources[1].histories').that.is.a('array');
				expect(result).to.have.deep.property('sources[1].histories').to.have.length(14);
				done();
			});
		});
	});

	describe('#getAlm() error handling', function() {
		this.timeout(10000);

		it('should return error if DOI not provided', function(done) {
			alm.getAlm('should_return_an_error', function(err, result) {
				expect(result).to.not.exist;
				expect(err).to.exist;

				done();
			});
		});

		it('should return useful error response if DOI not provided', function(done) {
			alm.getAlm('should_return_an_error', function(err, result) {
				var expected = {
					statusCode: 404,
					statusResponse: 'Article not found.',
					body: { error: 'Article not found.' }
				};

				expect(err).to.deep.equal(expected);

				done();
			});
		});
	});
});