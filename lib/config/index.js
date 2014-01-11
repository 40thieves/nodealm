var config = {
	// Dev config
	development: {
		mode: 'development',

		api_key: 'YOUR_API_KEY_GOES_HERE'
	},
};

module.exports = function(mode) {
	return config[mode || process.argv[2] || 'development'] || config.development;
};