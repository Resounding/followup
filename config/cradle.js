
var config = require('./cradle_config')[process.env.NODE_ENV || 'production'],
	util = require('util'),
	cradle = require('cradle'),
	conn = new (cradle.Connection)(config.url, config.port, {
		auth: { username: config.user.username, password: config.user.password }
	}),
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
			var now = new Date().getTime(),
			    date = Date.parse(doc.nextContact.date) || now,
				overdue = date < now,
				confirmed = !!doc.nextContact.confirmed;

			emit([!overdue, !confirmed, date], doc);
		}
	},
	tagsView = function(doc) {
		if(Array.isArray(doc.tags)) {
			doc.tags.forEach(function(tag) {
				emit(tag.replace(/\ /g, '').toLowerCase(), tag);
			});
		}
	};

db.get(PEOPLE_VIEW_NAME, function(err, doc) {
	
	if((err && err.error == 'not_found') || doc == null) {
		console.log('creating design document');
		conn.auth = { username: config.admin.username, password: config.admin.password };
		db.save(PEOPLE_VIEW_NAME, {
			views: {
				lastName: {
					map: lastNameView.toString()
				},
				followups: {
					map: followupsView.toString()
				},
				tags: {
					map: tagsView.toString()
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