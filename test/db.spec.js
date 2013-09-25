var assert = require('assert');

describe('Couch DB', function() {
	var config = require('../config/cradle_config')[process.env.NODE_ENV || 'test'],
		cradle = require('cradle'),
		conn = new (cradle.Connection)(config.url, config.port, {
			auth: { username: config.user.username, password: config.user.password }
		}),
		db = conn.database(config.database);

	before(function(done) {
		db.exists(function(err, result) {
			if(err) return done(err);

			if(result) {
				db.destroy(function(destroyErr, destroyResult) {
					if(destroyErr) return done(destroyErr);

					db.create(function(createErr, createResult) {
						if(createErr) return done(createErr);

						db.create();
						done();
					});
				})
			} else {
				db.create();
				done();
			}
		});
	});
});