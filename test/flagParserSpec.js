var expect = require('chai').expect
,	flags = require('../lib/flagParser')
;

describe('Flags', function() {
	describe('#parse()', function() {
		it('should parse long key/value flags', function() {
			var args = ['--foo=4', '--hello=world'] // Mock args
			,	results = flags.parse(args)
			;

			expect(results).to.have.a.property('foo', 4);
			expect(results).to.have.a.property('hello', 'world');
		});

		it('should parse long boolean flags', function() {
			var args = ['--search']
			,	results = flags.parse(args)
			;

			expect(results).to.have.a.property('search', true);
		});

		it('should fallback to defaults', function() {
			var args = ['--foo=4', '--hello=world']
			,	defaults = { foo: 4, bar: 'baz' }
			;

			var results = flags.parse(args, defaults);

			var expected = {
				foo: 4,
				bar: 'baz',
				hello: 'world'
			};

			expect(results).to.deep.equal(expected);
		});

		it('should parse short flags', function() {
			var args = ['-sf=4', '-h'];

			var replacements = {
				s: 'search',
				f: 'foo',
				h: 'hello'
			};

			var results = flags.parse(args, {}, replacements);

			var expected = {
				search: true,
				foo: 4,
				hello: true
			};

			expect(results).to.deep.equals(expected);
		});
	});
});