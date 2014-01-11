#!/usr/bin/env node

var alm = require('./lib/nodeAlm')
,	tags = require('./lib/flagParser')
,	tagDefaults = {}
,	tagReplacements
,	options
;

tagReplacements = {
	i: 'info',
	d: 'days',
	m: 'months',
	y: 'year'
};

options = tags.parse(process.argv, tagDefaults, tagReplacements);

alm.getAlm(options.ids, { info: 'summary' }, function(err, result) {
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
