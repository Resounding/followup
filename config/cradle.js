var util = require('util'),
	cradle = require('cradle'),
	conn = new (cradle.Connection)('https://cliffeh.cloudant.com', 443, {
		auth: { username: 'heretworecomeesecepitspl', password: 'LwBQiuKLH7ETPYV3H7rsLKvF' }
	})
	db = conn.database('followup');

db.exists(function(err, exists) {
	if(err) {
		console.log('error', err);
	} else if(!exists) {
		db.create();
	}
});

var PEOPLE_VIEW_NAME = '_design/people',
	lastNameView = function (doc) {
		if(doc.type === 'person') {
			emit(doc.lastName, doc);
		}
	},
	followupsView = function(doc) {
		if(doc.type === 'person' && doc.nextContact) {
			emit([!doc.nextContact.confirmed,doc.nextContact.date], doc);
		}
	};

db.get(PEOPLE_VIEW_NAME, function(err, doc) {
	
	if((err && err.error == 'not_found') || doc == null) {
		console.log('creating design document');
		conn.auth = { username: 'cliffeh', password: 'N!chir1n' };
		db.save(PEOPLE_VIEW_NAME, {
			views: {
				lastName: {
					map: lastNameView.toString()
				},
				followups: {
					map: followupsView.toString()
				}
			}
		}, function(saveErr, result) {
			if(saveErr) {
				console.log('error saving design document: ' + util.inspect(saveErr));
			} else {
				console.log('design doc saved: ' + util.inspect(result));
			}
		})
	} else if(err) {
		console.log('error getting design doc: ' + util.inspect(err));
	} else {
		console.log('design doc exists');
	}
});

module.exports = db;
