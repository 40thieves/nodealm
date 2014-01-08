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
		if (err || res.statusCode != 200)
			callback(err, null);

		callback(null, JSON.parse(body));
	});
};

buildQuery = function(ids, options) {
	var query = 'http://alm.plos.org/api/v3/articles?';

	query += 'api_key=' + exports.apiKey;
	query += '&ids=' + ids.join(',');

	if (options.info)
		query += '&info=' + options.info;

	return query;
};