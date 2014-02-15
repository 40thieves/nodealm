var util         = require('util')
,	EventEmitter = require('events').EventEmitter

,	request = require('request')
,	_       = require('underscore')

,	configs = require('./config')
;

var extend = function(orig, extra) {
	return Object.keys(extra).forEach(function(key) {
		orig[key] = extra[key];
	});
};

var Alm = function(ids, options) {
	config = configs(this.options.mode);

	if (options)
		extend(config, options);

	this.ids = ids;
};

util.inherits(Alm, EventEmitter);

Alm.prototype.options = {
	mode: undefined
};

buildQuery = function(ids) {
	var base = config.base_url;

	base += 'api_key=' + config.api_key;

	if (config.info)
		base += '&info=' + config.info;

	if (config.source)
		base += '&source=' + config.source;

	if (config.days)
		base += '&days=' + config.days;

	if (config.months)
		base += '&months=' + config.months;

	if (config.year)
		base += '&year=' + config.year;

	if (_.isArray(ids))
		ids = ids.join(',');

	return base += '&ids=' + ids;
};

checkForErrors = function(err, res, body) {
	var self = this;

	parseJson = function(json) {
		try {
			return JSON.parse(json);
		}
		catch (e) {
			return self.throwError('JSON parse error');
		}
	};

	if (err)
		this.throwError(err.message);
	else if (res.statusCode == 404)
		return this.throwError('No article found');
	else if (res.statusCode != 200)
		return this.throwError('Request error');

	body = parseJson(body);
	if (body.length < 1)
		return this.throwError('No article found');

	sendResponse.call(this, parseResponse(body));
};

parseResponse = function(res) {
	if (config.expand_sources)
		return res;

	// Pull out article object if only 1 in response - only 1 article requested
	// Don't have to call result[0] to get result object
	if (res.length == 1)
		res = res.shift();

	// Turn sources array into sources object, with a property for each data source
	// Each data source keyed to the source's name
	// Can retrieve sources.twitter rather than sources[10] - more readable
	if (res.sources)
		res.sources = _.indexBy(res.sources, 'name');

	return res;
};

sendResponse = function(res) {
	this.emit('success', res);
};

Alm.prototype.fetch = function() {
	var query = buildQuery(this.ids);
	request(query, checkForErrors.bind(this));
};

Alm.prototype.throwError = function(message) {
	this.emit('error', new Error(message));
	return false;
};

module.exports = Alm;