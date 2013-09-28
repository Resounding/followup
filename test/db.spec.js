var assert = require('assert'),
	moment = require('moment')
	util = require('util'),
	_ = require('underscore');

describe('Couch DB', function() {
	
	describe('Followups view', function() {

		beforeEach(function() {
			this.next_id = 0;
			this.base_followup = { type: 'person' };
		});

		it('should only return followups for today or before', function(done) {
			
			var db = this.db,
				data = [
					_.extend({ id: this.next_id++, nextContact: {} }, this.base_followup), 
					_.extend({ id: this.next_id++, nextContact: {} }, this.base_followup),
					_.extend({ id: this.next_id++, nextContact: {} }, this.base_followup)
				];
			
			data[0].nextContact.date = moment().format();
			data[1].nextContact.date = moment().add('d', 1).format();
			data[2].nextContact.date = moment().add('d', -1).format();
			

			db.save(data, function(err, saveRes) {

				this.rows = saveRes;

				db.view('people/followups', function(err, dbRes) {

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