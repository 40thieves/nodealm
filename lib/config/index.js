var config = {
	// Dev config
	development: {
		mode: 'development',

		api_key: 'cjt9z8w52sFZN31sC3Gw'
	},
};

module.exports = function(mode) {
	return config[mode || process.argv[2] || 'development'] || config.development;
};