#!/usr/bin/env node

var alm = require('./lib/nodeAlm')
,	tags = require('./lib/flagParser')
,	cliConfig = require('./lib/config/cli')
,	options
;

// Command args parsed to get options object
options = tags.parse(process.argv, cliConfig.flagDefaults, cliConfig.flagReplacements);

alm.getAlm(options.ids, { info: 'summary' }, function(err, result) {
	// Handle errors
	if (err) {
		console.log('Error:', err.statusResponse);
		console.log('Error code:', err.statusCode);
		return;
	}

	if (typeof result === 'object' && result instanceof Array) {
		// Result is an array - loop through each
		result.forEach(function(r) {
			print(r);
		});
	}
	else {
		print(result);
	}
});

/**
 * Prints summary result to console
 * @param  {Object} result Result object
 */
function print(result) {
	console.log('Metadata');
	console.log('DOI:', result.doi);
	console.log('Title: ', result.title);
	console.log('URL: ', result.url);

	console.log('\nSummary altmetrics');
	console.log('Views: ', result.views);
	console.log('Shares: ', result.shares);
	console.log('Bookmarks: ', result.bookmarks);
	console.log('Citations: ', result.citations);
	console.log('\n');
}
