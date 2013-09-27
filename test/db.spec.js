var assert = require('assert'),
	moment = require('moment')
	util = require('util');

describe('Couch DB', function() {
	
	before(function(done) {
		this.db = require('../config/cradle').on('ready', done);		
	});

	describe('Followups view', function() {
		it('should only return followups for today or before', function(done) {
			return done();
			var data = [
				{
					id: 1,
					type: 'person',
					nextContact: {
						date: moment().format()
					}
				},
				{
					id: 2,
					type: 'person',
					nextContact: {
						date: moment().add('d', 1).format()
					}
				},
				{
					id: 3,
					type: 'person',
					nextContact: {
						date: moment().add('d', -1).format()
					}
				}
			];

			this.db.save(data, function(err, saveRes) {

				this.db.view('people/followups', function(err, dbRes) {

					assert.equal(2, dbRes.length, 'only 2 rows should have been returned.');

					assert.equal(3, dbRes[0].value.id, 'overdue item is first');
					assert.equal(1, dbRes[1].value.id, 'today\'s item is second');
					done();
				});
			});
		});

		it('shouldn\'t mark items from earlier in the day as overdue');
	});
});