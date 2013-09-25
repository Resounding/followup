var assert = require('assert'),
	request = require('supertest'),
	app = require('./setup'),
	routes = require('../config/routes')(app),
	util = require('util'),
	moment = require('moment');


describe('People routes', function() {
	before(function(done) {
		this.db = require('../config/cradle').on('ready', done);
	});

	after(function(done) {
		this.db.destroy(done);
	});

	beforeEach(function(done) {
		var that = this;

		this.db.save({
			type: 'person',
			firstName: 'Test',
			lastName: 'User',
			organization: 'Test Org',
			nextContact: {
				type: 'schedule',
				date: moment().format()
			},
			interval: 'q',
			contacts: [],
			phones: [],
			email: 'abc@example.com',
			address: {
				street: '123 Main',
				city: 'Somewhere',
				province: 'ON'
			}
		}, function(err, res) {
			that.doc = res;
			done();
		});
	});

	describe('People collection', function() {
		it('should return html successfully', function(done) {
			request(app)
				.get('/people')
				.expect('Content-Type', /html/)
				.expect(200, done);				
		});
	});

	describe('New person', function() {
		it('should return html successfully', function(done) {
			request(app)
				.get('/people/new')
				.expect('Content-Type', /html/)
				.expect(200, done);
		});
	});

	describe('Create person', function() {
		it('should return html successfully', function(done) {
			request(app)
				.post('/people')
				.type('form')
				.send(this.doc)
				.expect(302, done);
		});
	});

	describe('Person detail', function() {
		it('should return html successfully', function(done) {
			
			var url = '/people/' + this.doc._id;

			request(app)
				.get(url)
				.expect('Content-Type', /html/)
				.expect(200, done);
		});
	});

	describe('Person edit', function() {
		it('should return html successfully', function(done) {

			var url = '/people/' + this.doc._id + '/edit';

			request(app)
				.get(url)
				.expect('Content-Type', /html/)
				.expect(200, done);
		});
	});

	describe('Update person', function() {
		it('should return html successfully', function(done) {

			var url = '/people/' + this.doc._id + '?_rev=' + this.doc._rev;

			this.doc.firstName = 'newname';

			request(app)
				.put(url)
				.set(this.doc)
				.expect(302, done);
		});
	});

	describe('Destroy person', function() {
		it('should return html successfully', function(done) {

			var url = '/people/' + this.doc._id + '?_rev=' + this.doc._rev;
			request(app)
				.del(url)
				.expect(302, done);
		});
	});

	describe('Person followup', function() {
		it('should return html successfully', function(done) {

			var url = '/people/' + this.doc.id + '/followup';

			request(app)
				.get(url)
				.expect('Content-Type', /html/)
				.expect(200, done);
		});
	});
});
