var db = require('./cradle'),
	people = require('../resource/people', db);

function Route(app) {
	var peopleResource = app.resource('people', people);

	peopleResource.map('get', 'followup', people.followup);
}

module.exports = Route;