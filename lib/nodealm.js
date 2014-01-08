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

	var query = 'http://alm.plos.org/api/v3/articles?api_key=cjt9z8w52sFZN31sC3Gw&ids=10.1371%2Fjournal.pbio.1000242';

	request(query, function(err, res, body) {
		if (err || res.statusCode != 200)
			callback(err, null);

		if ( ! err && res.statusCode == 200) {
			callback(null, {});
		}
	});
};