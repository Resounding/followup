
var mode = process.env.NODE_ENV || 'production',
	config = require('./cradle_config')[mode],
	util = require('util'),
	emitter = new (require('events').EventEmitter)(),
	cradle = require('cradle'),
	conn = new (cradle.Connection)(config.url, config.port, {
		auth: { username: config.user.username, password: config.user.password }
	}),
	db = conn.database(config.database),
	fs = require('fs'),
	momentText = fs.readFileSync('./public/js/moment.js').toString();

var ready;
emitter.on('ready', function() {
	ready = true;
});

db.on = function(event, callback) {
	if(ready) {
		callback();
	} else {
		emitter.on(event, callback);
	}
	return db;
};

var PEOPLE_VIEW_NAME = '_design/people',
	lastNameView = function (doc) {
		if(doc.type === 'person') {
			emit(doc.lastName, doc);
		}
	},
	followupsView = function(doc) {

		if(doc.type === 'person' && doc.nextContact) {

			var moment = require('views/lib/moment'),
				date = moment(doc.nextContact.date);

			if(date.isSame(moment(), 'day') || date.isBefore()) {
				var overdue = !date.isSame(moment(), 'day'),
					confirmed = !!doc.nextContact.confirmed;

				emit(date.format('YYYYMMDD'), doc);
			}
		}
	},
	tagsView = function(doc) {
		if(Array.isArray(doc.tags)) {
			doc.tags.forEach(function(tag) {
				emit(tag.replace(/\ /g, '').toLowerCase(), tag);
			});
		}
	};

db.exists(function(err, exists) {
	if(err) {
		console.log('error', err);
	} else if(!exists) {
		db.create();
	}

	db.get(PEOPLE_VIEW_NAME, function(err, doc) {
		
		if((err && err.error == 'not_found') || doc == null) {
			if(mode !== 'test') {
				console.log('creating design document');
			}
			conn.auth = { username: config.admin.username, password: config.admin.password };

			var json = {
				views: {
					lastName: {
						map: lastNameView.toString()
					},
					followups: {
						map: followupsView.toString()
					},
					tags: {
						map: tagsView.toString()
					},
					lib: { }
				}
			};
			json.views.lib.moment = momentText;

			db.save(PEOPLE_VIEW_NAME, json, function(saveErr, result) {
				if(saveErr) {
					console.log('error saving design document: ' + util.inspect(saveErr));
				} else {				
					if(mode !== 'test') {
						console.log('design doc saved: ' + util.inspect(result));
					}
				}

				emitter.emit('ready');
			})
		} else if(err) {		
			console.log('error getting design doc: ' + util.inspect(err));
		} else {
			if(mode !== 'test') {
				console.log('design doc exists');
			}
			emitter.emit('ready');
		}
	});
});

module.exports = db;