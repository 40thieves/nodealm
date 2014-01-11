var	_ = require('underscore')
,	request = require('request')
,	config = require('./config')()
;

exports = module.exports = {};

exports.apiKey = config.api_key;

exports.getAlm = function(ids, options, callback) {
	// Handle single id
	if (_.isString(ids))
		ids = [ids];

	// Handle no options object
	if (_.isFunction(options)) {
		callback = options;
		options = {};
	}

	var query = buildQuery(ids, options);

	request(query, function(err, res, body) {
		if (err) {
			return callback(err, null);
		}
		else if (res.statusCode != 200) {
			body = JSON.parse(body);

			err = {
				statusCode: res.statusCode,
				statusResponse: body.error,
				body: body
			};

			return callback(err, null);
		}

		body = JSON.parse(body);

		// Pull out article object if only 1 in response - only 1 article requested
		// Don't have to call result[0] to get result object
		if (body.length == 1)
			body = body.shift();

		// Turn sources array into sources object, with a property for each data source
		// Each data source keyed to the source's name
		// Can retrieve sources.twitter rather than sources[10] - more readable
		if (body.sources)
			body.sources = _.indexBy(body.sources, 'name');

		return callback(null, body);
	});
};

buildQuery = function(ids, options) {
	var query = 'http://alm.plos.org/api/v3/articles?';

	query += 'api_key=' + exports.apiKey;
	query += '&ids=' + ids.join(',');

	if (options.info)
		query += '&info=' + options.info;

	if (options.days)
		query += '&days=' + options.days;

	if (options.months)
		query += '&months=' + options.months;

	if (options.year)
		query += '&year=' + options.year;

	return query;
};