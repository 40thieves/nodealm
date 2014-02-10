## nodeALM

### Node wrapper for the PLOS ALM API

A Node port of [Cameron Neylon's](http://cameronneylon.net/) [`pyalm`](http://cameronneylon.github.io/pyalm/) library. A wrapper for the Public Library of Science (PLOS) [Article Level Metrics (ALM) API](http://alm.plos.org/docs/API).

```javascript
var Alm = require('nodealm');

var alm = new Alm('10.1371/journal.pbio.1000242');

alm.on('success', function(result) {
	console.log('DOI:', result.doi); // Article's DOI
	console.log('Title: ', result.title); // Article's title
	console.log('URL: ', result.url); // Article's URL

	console.log('Views: ', result.views); // Article's total views
	console.log('Shares: ', result.shares); // Article's total shares
	console.log('Bookmarks: ', result.bookmarks); // Article's total bookmarks
	console.log('Citations: ', result.citations); // Article's total citations
});

alm.fetch();
```

### Installation

	npm install nodealm

### Summary level information - Example response

```javascript
// DOI 10.1371/journal.pone.0036240
result = {
	doi: '10.1371/journal.pone.0036240',
	title: 'How Academic Biologists and Physicists View Science Outreach',
	url: 'http://www.plosone.org/article/info%3Adoi%2F10.1371%2Fjournal.pone.0036240',

	mendeley: '88bfe7f0-9cb4-11e1-ac31-0024e8453de6', // Mendeley article id
	pmid: '22590526', // PubMed id
	pmcid: '3348938', // PubMed Central id

	publication_date: '2012-05-09T07:00:00Z',
	update_date: '2014-01-11T14:20:30Z',

	views: 12987,
	shares: 276,
	bookmarks: 38,
	citations: 3,
	...,
}
```

### More detailed source information - Example response

The response also returns an array of ALM data sources with more detailed information.

```javascript
// DOI 10.1371/journal.pone.0036240
result = {
	...,
	sources: {
		twitter: {
			name: 'twitter',
			display_name: 'Twitter',
			events_url: null,
			metrics: {
				pdf: null,
				html: null,
				shares: null,
				groups: null,
				comments: 136,
				likes: null,
				citations: null,
				total: 136
			}
		},
		...,
	}
}
```

### Advanced usage

Multiple articles can be requested by providing and array of DOIs

```javascript
var alm = new Alm(['10.1371/journal.pbio.1000242', '10.1371/journal.pone.0035869']);
```

Additional options are provided through the options object

```javascript
var options = {
	info: 'history',
	days: 30
};

alm.getAlm('10.1371/journal.pbio.1000242', options, callback);
```

#### Available options

__info__

Controls the amount of detail provided in the response

| Value    | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| summary  | Only article metadata (DOI, title, PubMed IDs) and summary metrics |
| detail   | All historical data and all raw data sent by the source            |
| event    | All raw data provided by the source                                |
| history  | All historical data, includes metrics by day, month and year       |

__source__

Filter the list of sources returned in response. A list of sources is available [here](http://alm.plos.org/sources).

__days__

Shows metrics after a given time in days of publication. So, for example, if set to 30, the metrics in the response will be calculated at the time 30 days after the article was published.

__months__

Similar to the `days` option, but calculates using months instead of days.

__year__

Similar to the `days` and `months` options but calculates the metrics at the end of the given year. For example, if set to 2012 the metrics will be calculated up to the end of 2012.

### Command line usage

(Please note, this feature isn't well fleshed out yet). To use with the command line, use the command

	node cli.js DOI_HERE

To request multiple DOIs, provide a comma-separated list of DOIs.

### Running tests

Tests are provided with [`mocha`](http://visionmedia.github.io/mocha/). Run the tests with

	npm test

(Please note that some tests will hit the API, and so will take longer to complete. This may change if/when I start mocking the API.)

### License

(The MIT License)

Copyright &copy; 2014 Alasdair Smith

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.