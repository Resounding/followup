var moment = require('moment')
	cons = require('consolidate'),
    _ = require('underscore'),
    util = require('util');

function Appointments(db) {
	return Appointments;
}

Appointments.index = function(req, res) {	
	res.render('appointments');
};

Appointments.new = function(req, res) {
	res.render('appointments/new');	
};

Appointments.show = function(req, res) {
	var date = moment(req.params.appointment || null, 'YYYYMMDD') || moment(),
		format = 'MMM DD';

	 if(!date.isSame(moment(), 'year')) {
	 	format += ', YYYY'
	 }

	res.render('appointments/show', {
		date: date,
		dateString: date.format(format)
	});
}

module.exports = Appointments;