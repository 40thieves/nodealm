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
	console.log('Metadata');
	console.log('DOI:', result[0].doi);
	console.log('Title: ', result[0].title);
	console.log('URL: ', result[0].url);
	console.log('\nSummary altmetrics');
	console.log('Views: ', result[0].views);
	console.log('Shares: ', result[0].shares);
	console.log('Bookmarks: ', result[0].bookmarks);
	console.log('Citations: ', result[0].citations);
});
