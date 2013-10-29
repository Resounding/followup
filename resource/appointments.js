var moment = require('moment')
	cons = require('consolidate'),
    _ = require('underscore'),
    toViewModel = require('../public/js/util/toViewModel'),
    util = require('util'),
	path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    baseDir = path.join(__dirname, '../public/tmpl/followups'),
    meetingHtml = fs.readFileSync(path.join(baseDir, 'meeting.html')).toString(),
    meeting = _.template(meetingHtml, null, { variable: 'd' }),
    phoneHtml = fs.readFileSync(path.join(baseDir, 'call.html')).toString(),
    phone = _.template(phoneHtml, null, { variable: 'd' });

var database;

function Appointments(db) {
	database = db;
	return Appointments;
}

Appointments.index = function(req, res) {	
	res.render('appointments');
};

Appointments.new = function(req, res) {
	database.view('people/lastName', function(err, people) {

		var followupDate = moment().startOf('hour');

		res.render('appointments/new', {
			title: 'New Appointment',
			people: people,
			today: followupDate.format(),
            todayString: followupDate.format('MMM D, YYYY'),
            nowString: followupDate.format('h:mm A')
		});	
	});
};

Appointments.create = function(req, res) {
	var client = req.body.client,
		nextContact = req.body;
	delete nextContact.client;

	nextContact.confirmed = nextContact.confirmed === 'true';

	database.get(client, function(err, person) {
		person.nextContact = nextContact;
		database.save(client, person, function() {
			res.redirect('/');
		});
	});
};

Appointments.show = function(req, res) {
	var date = moment(req.params.appointment || null, 'YYYYMMDD') || moment(),
		format = 'ddd, MMM DD';

	 if(!date.isSame(moment(), 'year')) {
	 	format += ', YYYY'
	 }


	 var appointments = _.map([
	 	{
	 		firstName: 'Jim',
	 		lastName: 'Smith',
	 		organization: 'RBC Ancaster',
	 		address: {
	 			street: '654 Wilson St.',
	 			city: 'Ancaster',
	 			province: 'ON'
	 		},
	 		nextContact: {
 				confirmed: true,
 				type: 'meeting',
	 			date: moment().hours(10).minutes(0).seconds(0).format(),
	 			reason: 'New client - introduce to NexGen'
	 		},
	 		email: 'jim.smith@rbc.com',
	 		phones: [
	 			{ 
	 				number: '(905) 648-5985' }
	 		],
	 		tags: [
	 			'New Client'
	 		]
	 	},
	 	{
	 		firstName: 'Fred',
	 		lastName: 'Johnson',
	 		organization: 'Bick Financial',
	 		address: {
	 			street: '888 Wilson St.',
	 			city: 'Ancaster',
	 			province: 'ON'
	 		},
	 		nextContact: {
 				confirmed: true,
 				type: 'meeting',
	 			date: moment().hours(11).minutes(0).seconds(0).format(),
	 			reason: 'Discuss Turtle funds'
	 		},
	 		email: 'fred@bick.ca',
	 		phones: [
	 			{ 
	 				number: '(905) 304-8876'
	 			}
	 		],
	 		tags: [
	 			'Turtle',
	 			'Fall Roadshow'
	 		]
	 	},
	 	{
	 		firstName: 'Laurie',
	 		lastName: 'Weston',
	 		organization: 'London Life',
	 		address: {
	 			street: '48 Bay St.',
	 			city: 'Mississauga',
	 			province: 'ON'
	 		},
	 		nextContact: {
 				confirmed: true,
 				type: 'call',
	 			date: moment().hours(11).minutes(30).seconds(0).format(),
	 			reason: 'Interested in Fall Roadshow'
	 		},
	 		email: 'lweston@londonlife.com',
	 		phones: [
	 			{ 
	 				number: '(800) 324-5588'
	 			}
	 		],
	 		tags: [
	 			'Div Inc',
	 			'Fall Roadshow'
	 		]
	 	},
	 	{
	 		firstName: 'Paul',
	 		lastName: 'Seguin',
	 		organization: 'Edward Jones',
	 		address: {
	 			street: '88655 South Service Rd.',
	 			city: 'Grimsby',
	 			province: 'ON'
	 		},
	 		nextContact: {
 				confirmed: true,
 				type: 'call',
	 			date: moment().hours(11).minutes(45).seconds(0).format(),
	 			reason: 'Met at conference - following up'
	 		},
	 		email: 'paul.seguin@edwardjones.com',
	 		phones: [
	 			{ 
	 				number: '(905) 578-0978'
	 			}
	 		],
	 		tags: [
	 			'Div Inc',
	 			'Fall Roadshow'
	 		]
	 	},
	 	{
	 		firstName: 'Peter',
	 		lastName: 'Clinton',
	 		organization: 'Investment Planning Group',
	 		address: {
	 			street: '1444 Main St. W.',
	 			city: 'Hamilton',
	 			province: 'ON'
	 		},
	 		nextContact: {
 				confirmed: true,
 				type: 'meeting',
	 			date: moment().hours(12).minutes(0).seconds(0).format(),
	 			reason: 'Lunch meeting at 1010 Bistro'
	 		},
	 		email: 'pclinton@ipg.com',
	 		phones: [
	 			{ 
	 				number: '(905) 525-2947'
	 			}
	 		],
	 		tags: [
	 			'Turtle',
	 			'Fall Roadshow',
	 			'Golf'
	 		]
	 	}
	 ], function(appointment) {
	 	var viewModel = toViewModel(appointment);

	 	return (viewModel.nextContact.type == 'call' ? phone : meeting)(viewModel);
	 });	 

	res.render('appointments/show', {
		date: date,
		dateString: date.format(format),
		queryStringDate: req.params.appointment,
		appointments: appointments
	});
}

module.exports = Appointments;