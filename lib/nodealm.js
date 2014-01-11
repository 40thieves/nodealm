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

		return callback(null, JSON.parse(body));
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