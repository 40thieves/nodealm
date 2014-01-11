var _ = require('underscore');

exports = module.exports = {};

exports.parse = function(args, defaults, replacements) {
	var options = {}
	,	dir = __dirname.substring(0, __dirname.length - 4)
	,	key
	,	value
	;

	if (typeof defaults === 'object' && !(defaults instanceof Array)) {
		options = defaults;
	}

	// Replaces short flags with long flags
	if (typeof replacements === 'object' && !(defaults instanceof Array)) {
		// Loop through arguments - separated by spaces
		args.forEach(function(arg) {
			// Test if short flag - uses '-'
			if (arg.charAt(0) === '-' && arg.charAt(1) != '-') {
				// Strip off - character
				arg = arg.substr(1);

				// Test if flag contains = char
				if (arg.indexOf('=') !== -1) {
					// Contains = char - key/value pair
					arg = arg.split('=');

					key = arg[0];
					value = arg[1];

					// Split to get combined boolean flags and key/value pairs
					arg = key.split('');
					// Get key from the newly split flags
					key = arg.pop();

					// Find short flag in replacements
					if (replacements.hasOwnProperty(key))
						key = replacements[key];

					args.push('--' + key + '=' + value);
				}
				else {
					// Contains no = char - boolean flag
					// Split to get multiple combined boolean flags
					arg = arg.split('');
				}

				// Now that combined short flags are split, loop through and find replacements
				arg.forEach(function(key) {
					if (replacements.hasOwnProperty(key))
						key = replacements[key];

					args.push('--' + key);
				});
			}
			// Test if args come from CLI - first two args are 'node' and the file path of invoking file
			else if (arg != 'node' && arg.indexOf(dir) == -1) {
				// Regex for DOIs. Source: http://stackoverflow.com/questions/27910/finding-a-doi-in-a-document-or-page
				var regex = /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)\b/
				,	doi
				;

				// Split ids on commas
				if (arg.indexOf(',')) {
					arg = arg.split(',');

					// Test ids against DOI regex
					doi = _.filter(arg, function(a) {
						return regex.test(a);
					});
				}
				else {
					// Test id against DOI regex
					if (regex.test(arg))
						doi = arg;
				}

				if (doi) {
					// Add ids arg to returned options - required option, so doesn't require flag to be set
					options.ids = doi;
				}
			}
		});
	}

	// Loop through expanded args
	args.forEach(function(arg) {
		// Test if long formed flag
		if (arg.substr(0, 2) === '--') {
			// Strip off -- characters
			arg = arg.substr(2);

			// Test for key/value pairs
			if (arg.indexOf('=') !== -1) {
				// Contains = char - key/value pair
				arg = arg.split('=');

				key = arg[0];
				value = arg[1];

				// Parse numbers
				if (/^[0-9]+$/.test(value))
					value = parseInt(value, 10);

				// Set value in returned option object 
				options[key] = value;
			}
			else {
				// Doesn't contain = char - boolean flag
				options[arg] = true;
			}
		}
	});

	return options;
};