#!/usr/bin/env node

var alm = require('./lib/nodeAlm')
,	tags = require('./lib/flagParser')
;

var tagDefaults = {};

var tagReplacements = {
	i: 'info',
	d: 'days',
	m: 'months',
	y: 'year'
};

var options = tags.parse(process.argv, tagDefaults, tagReplacements);

console.log(options);
