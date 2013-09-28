var assert = require('assert');

before(function(done) { 
	this.db = require('../config/cradle').on('ready', done);
});

after(function(done) {
	this.db.destroy(function() {
		done();
	});
});