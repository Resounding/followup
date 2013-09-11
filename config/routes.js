var db = require('./cradle'),
	followups = require('../resource/followups')(db),	
	people = require('../resource/people')(db),
	search = require('../resource/search')(db);

function Route(app) {

	// top level route
	var followupsResource = app.resource('/', followups);

	var searchResource = app.resource('search', search);

	// map to /people
	var peopleResource = app.resource('people', people);
	// add the custom route /people/:id/followup
	peopleResource.map('get', 'followup', people.followup);
	peopleResource.map('put', 'followup', people.recordContact);
}

module.exports = Route;