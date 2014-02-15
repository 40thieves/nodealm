var apiKey = require('./apiKey');

var config = {
	// Dev config
	development: {
		mode: 'development',

		expand_sources: false,

		base_url: 'http://alm.plos.org/api/v3/articles?',
		api_key: apiKey,
		source: 'twitter,counter,scopus,mendeley,citeulike,crossref,datacite,pmceurope,pmceuropedata,pubmed,facebook,nature,reddit,researchblogging,wikipedia,wordpress,figshare,scienceseeker,pmc,articlecoverage,articlecoveragecurated,relativemetric,f1000,webofscience'
	},
};

module.exports = function(mode) {
	return config[mode || process.argv[2] || 'development'] || config.development;
};