var people = require('../resource/people');

function Route(app) {
	var peopleResource = app.resource('people', people);

	peopleResource.map('get', 'followup', people.followup);
}

module.exports = Route;