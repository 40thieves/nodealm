## nodeALM

### Node wrapper for the PLOS ALM API

A Node port of [Cameron Neylon's](http://cameronneylon.net/) [`pyalm`](http://cameronneylon.github.io/pyalm/) library. A wrapper for the Public Library of Science (PLOS) [Article Level Metrics (ALM) API](http://alm.plos.org/docs/API).

```javascript
var alm = require('nodealm');

alm.getAlm('10.1371/journal.pbio.1000242', function(err, result) {
	console.log('DOI:', result[0].doi); // Article's DOI
	console.log('Title: ', result[0].title); // Article's title
	console.log('URL: ', result[0].url); // Article's URL

	console.log('Views: ', result[0].views); // Article's total views
	console.log('Shares: ', result[0].shares); // Article's total shares
	console.log('Bookmarks: ', result[0].bookmarks); // Article's total bookmarks
	console.log('Citations: ', result[0].citations); // Article's total citations
});
```

### Installation

	npm install nodealm

### Summary level information - Example response

```javascript
// DOI 10.1371/journal.pone.0036240
result[0] = {
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
result[0] = {
	...,
	sources: [
		{
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
		}
	]
}
```

### Running tests

Tests are provided with [`mocha`](http://visionmedia.github.io/mocha/). Run the tests with

	npm test

(Please note that some tests will hit the API, and so will take longer to complete)

#### TODO

* Only return array if multiple articles found
* Sources array should use source name as key, not numerical key
* Filter null values in response?
* (Possibly) Raw output: json/xml/csv
	* The media type is set in the header, e.g. 'Accept: application/json'. Media type negotiation via file extension (e.g. '.json') is not supported

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