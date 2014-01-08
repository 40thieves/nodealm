var	_ = require('underscore')
,	request = require('request')
,	config = require('./config')()
;

exports = module.exports = {};

exports.apiKey = config.api_key;

exports.getAlm = function(ids, callback) {
	// Handle single id
	if (_.isString(ids)) {
		ids = [ids];
	}

	var query = buildQuery(ids);

	request(query, function(err, res, body) {
		if (err || res.statusCode != 200)
			callback(err, null);

		callback(null, JSON.parse(body));
	});
};

buildQuery = function(ids) {
	var query = 'http://alm.plos.org/api/v3/articles?';

	query += 'api_key=' + this.apiKey;
	query += '&ids=' + ids.join(',');

	return query;
};