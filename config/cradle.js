var cradle = require('cradle'),
	conn = new (cradle.Connection)('https://cliffeh:N!chir1n@cliffeh.cloudant.com', 443, {
		auth: { username: 'cliffeh', password: 'N!chir1n' }
	})
	db = conn.database('followup');

db.exists(function(err, exists) {
	if(err) {
		console.log('error', err);
	} else if(!exists) {
		db.create();
	}
});

var PEOPLE_VIEW_NAME = '_design/people';

var peopleView = function (doc) {
	if(doc.type === "person") {
		emit(doc.lastName, doc);
	}
}

db.get(PEOPLE_VIEW_NAME, function(err, doc) {
	if(doc == null) {
		db.save(PEOPLE_VIEW_NAME, {
			views: {
				lastName: {
					map: peopleView.toString()
				}
			}
		})
	}
});

module.exports = db;
