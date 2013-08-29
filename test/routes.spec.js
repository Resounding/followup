var assert = require('assert'),
	request = require('supertest'),
	express = require('express'),
	Resource = require('express-resource'),
	app = express(),
	routes = require('../config/routes')(app);


describe('People routes', function() {
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
				.expect('Content-Type', /html/)
				.expect(200, done);
		});
	});

	describe('Person detail', function() {
		it('should return html successfully', function(done) {
			request(app)
				.get('/people/123')
				.expect('Content-Type', /html/)
				.expect(200, done);
		});
	});

	describe('Person edit', function() {
		it('should return html successfully', function(done) {
			request(app)
				.get('/people/123/edit')
				.expect('Content-Type', /html/)
				.expect(200, done);
		});
	});

	describe('Update person', function() {
		it('should return html successfully', function(done) {
			request(app)
				.put('/people/123')
				.expect('Content-Type', /html/)
				.expect(200, done);
		});
	});

	describe('Destroy person', function() {
		it('should return html successfully', function(done) {
			request(app)
				.del('/people/123')
				.expect('Content-Type', /html/)
				.expect(200, done);
		});
	});

	describe('Person followup', function() {
		it('should return html successfully', function(done) {
			request(app)
				.get('/people/123/followup')
				.expect('Content-Type', /html/)
				.expect(200, done);
		});
	});
});
