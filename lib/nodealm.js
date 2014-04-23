var util         = require('util')
,	EventEmitter = require('events').EventEmitter

,	request = require('request')
,	_       = require('underscore')

,	configs = require('./config')
;

/**
 * Extends an object with new properties, preferentially using properties from the new object. Useful for inheritance
 * @param  {Obj} orig  Original object, to be extended. Properties with the same key as the new object will be overridden
 * @param  {Obj} extra Extending object. Any properties in this object that are not in the original will be added
 * @return {Obj}       Extended object
 */
var extend = function(orig, extra) {
	return Object.keys(extra).forEach(function(key) {
		orig[key] = extra[key];
	});
};

/**
 * Constructor for Alm class
 * @param {String|Array} ids     List of article DOIs for which request data
 */
var Alm = function(ids, options) {
	// Default options combined with input options
	config = configs(this.options.mode);

	// Get config for current mode/env
	if (options)
		extend(config, options);

	this.ids = ids;
};

// Sets up inheritance to give events functionality
util.inherits(Alm, EventEmitter);

/**
 * Default options hash
 */
Alm.prototype.options = {
	mode: undefined
};

/**
 * Builds request string using config and list of DOIs
 * @param  {Array} ids List of DOIs to include in request
 * @return {String}    Request string
 */
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

/**
 * Checks response for errors, throws error events if found
 * @param  {Obj} err  Error object
 * @param  {Obj} res  Full response object
 * @param  {Obj} body Body of response (containing JSON)
 */
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
	// Additional check for no articles (should return 404)
	if (body.length < 1)
		return this.throwError('No article found');

	sendResponse.call(this, parseResponse(body));
};

/**
 * Parses successful response and transforms to a more useful structure
 * @param  {Obj} res Response object
 * @return {Obj}     Parsed/transformed object
 */
parseResponse = function(res) {
	if ( ! config.expand_sources)
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

/**
 * Emits success event with data from successful response
 * @param  {Obj} res Response data
 */
sendResponse = function(res) {
	this.emit('success', res);
};

/**
 * Kicks off request to API
 */
Alm.prototype.fetch = function() {
	var query = buildQuery(this.ids);
	request(query, checkForErrors.bind(this));
};

/**
 * Emits error event
 * @param  {String} message Error message
 */
Alm.prototype.throwError = function(message) {
	this.emit('error', new Error(message));
	return false;
};

module.exports = Alm;