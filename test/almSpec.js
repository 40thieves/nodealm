/* jshint expr: true */
var expect = require('chai').expect
,	Alm = require('../lib/nodeAlm')
;

describe('ALM', function() {
	describe('General fetch', function() {
		this.timeout(10000);

		it('should take a DOI as the first argument', function(done) {
			var alm = new Alm('10.1371/journal.pbio.1000242');

			alm.on('success', function(result) {
				expect(result).to.exist;

				done();
			});

			alm.fetch();
		});

		it('should take an array of DOIs as the first argument', function(done) {
			var alm = new Alm(['10.1371/journal.pbio.1000242', '10.1371/journal.pone.0035869']);

			alm.on('success', function(result) {
				expect(result).to.be.a('array');

				done();
			});

			alm.fetch();
		});

		it('should return an object containing the article\'s metadata', function(done) {
			var alm = new Alm('10.1371/journal.pbio.1000242');

			alm.on('success', function(result) {
				expect(result).to.have.deep.property('doi');
				expect(result).to.have.deep.property('title');
				expect(result).to.have.deep.property('url');
				expect(result).to.have.deep.property('mendeley');
				expect(result).to.have.deep.property('pmid');
				expect(result).to.have.deep.property('pmcid');
				expect(result).to.have.deep.property('publication_date');

				done();
			});

			alm.fetch();
		});

		it('should return an object containing aggregated altmetrics for the article', function(done) {
			var alm = new Alm('10.1371/journal.pbio.1000242');

			alm.on('success', function(result) {
				expect(result).to.have.deep.property('views');
				expect(result).to.have.deep.property('shares');
				expect(result).to.have.deep.property('bookmarks');
				expect(result).to.have.deep.property('citations');

				done();
			});

			alm.fetch();
		});

		it('should return an array of sources with more detailed altmetric data for the article', function(done) {
			var expectedKeys = [
				'name',
				'display_name',
				'events_url',
				'metrics',
				'update_date'
			];

			var alm = new Alm('10.1371/journal.pbio.1000242');

			alm.on('success', function(result) {
				expect(result).to.have.deep.property('sources').that.is.a('object');
				expect(result).to.have.deep.property('sources.twitter').that.include.keys(expectedKeys);
				expect(result).to.have.deep.property('sources.twitter.metrics').to.be.a('object');

				done();
			});

			alm.fetch();
		});

	});

	describe('Fetch with options', function() {
		this.timeout(10000);

		it('should take an object of options as the second argument', function(done) {
			var options = {
				info: 'summary'
			};

			var alm = new Alm('10.1371/journal.pbio.1000242', options);

			alm.on('success', function(result) {
				expect(result).to.exist;
				done();
			});

			alm.fetch();
		});

		it('should have an option for requesting history of altmetrics', function(done) {
			var options = {
				info: 'history'
			};

			var alm = new Alm('10.1371/journal.pbio.1000242', options);

			alm.on('success', function(result) {
				expect(result).to.have.deep.property('sources.twitter.histories');
				expect(result).to.have.deep.property('sources.twitter.by_day');
				expect(result).to.have.deep.property('sources.twitter.by_month');
				expect(result).to.have.deep.property('sources.twitter.by_year');

				done();
			});

			alm.fetch();
		});

		it('should have an option for requesting altmetric events', function(done) {
			var options = {
				info: 'event'
			};

			var alm = new Alm('10.1371/journal.pbio.1000242', options);

			alm.on('success', function(result) {
				expect(result).to.have.deep.property('sources.twitter.events').that.is.a('array');

				done();
			});

			alm.fetch();
		});

		it('should have an option for setting days (after publication) option', function(done) {
			var options = {
				days: '1700',
				info: 'history'
			};

			var alm = new Alm('10.1371/journal.pbio.1000242', options);

			alm.on('success', function(result) {
				expect(result).to.have.deep.property('sources.twitter.histories').that.is.a('array');
				expect(result).to.have.deep.property('sources.twitter.histories').to.have.length(3);

				done();
			});

			alm.fetch();
		});

		it('should have an option for setting months (after publication) option', function(done) {
			var options = {
				months: 60,
				info: 'history'
			};

			var alm = new Alm('10.1371/journal.pbio.1000242', options);

			alm.on('success', function(result) {
				expect(result).to.have.deep.property('sources.twitter.histories').that.is.a('array');
				expect(result).to.have.deep.property('sources.twitter.histories').to.have.length(3);

				done();
			});

			alm.fetch();
		});

		it('should have an option for setting specific year to calculate metrics', function(done) {
			var options = {
				year: 2014,
				info: 'history'
			};

			var alm = new Alm('10.1371/journal.pbio.1000242', options);

			alm.on('success', function(result) {
				expect(result).to.have.deep.property('sources.citeulike.histories').that.is.a('array');
				expect(result).to.have.deep.property('sources.citeulike.histories').to.have.length(1);

				done();
			});

			alm.fetch();
		});

		it('should disable expansion of source array', function(done) {
			var options = {
				expand_sources: true
			};

			var expectedKeys = [
				'name',
				'display_name',
				'events_url',
				'metrics',
				'update_date'
			];

			var alm = new Alm('10.1371/journal.pbio.1000242', options);

			alm.on('success', function(result) {
				expect(result).to.have.deep.property('[0].sources').that.is.a('array');
				expect(result).to.have.deep.property('[0].sources[10]').that.include.keys(expectedKeys);
				expect(result).to.have.deep.property('[0].sources[10].metrics').to.be.a('object');
				expect(result).to.have.deep.property('[0].sources[10].name').to.equal('twitter');

				done();
			});

			alm.fetch();
		});
	});

	describe('Error handling', function() {
		this.timeout(10000);

		it('should return error if DOI not provided', function(done) {
			var alm = new Alm('should return an error');

			alm.on('error', function(err) {
				expect(err).to.exist;

				done();
			});

			alm.fetch();
		});

		it('should return useful error response if DOI not provided', function(done) {
			var alm = new Alm('should return an error');

			alm.on('error', function(err) {
				expect(err.message).to.deep.equal('No article found');

				done();
			});

			alm.fetch();
		});
	});
});