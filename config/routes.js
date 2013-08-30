var db = require('./cradle'),
	followups = require('../resource/followups')(db),	
	people = require('../resource/people')(db);

function Route(app) {

	// top level route
	var followupsResource = app.resource('/', followups);

	// map to /people
	var peopleResource = app.resource('people', people);
	// add the custom route /people/:id/followup
	peopleResource.map('get', 'followup', people.followup);
}

module.exports = Route;