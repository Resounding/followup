var util = require('util'),
    cons = require('consolidate'),
    moment = require('moment'),
    database;

function Followups(db) {
  database = db;
  createTemplates();
  return Followups;
}

Followups.index = function(req, res){
  database.view('people/followups', function(err, dbRes) {  	

    var rows = (Array.isArray(dbRes) ? dbRes : []).map(toHtml);

    res.render('followups', {
      followups: rows
    });  
  });  
};

var meetingTmpl,
    callTmpl,
    emailTmpl,
    scheduleTmpl;
function loadFile(fileName) {
    var path = require('path'),
        fs = require('fs'),
        _ = require('underscore'),
        baseDir = path.join(__dirname, '../public/tmpl/followups');

    return fs.readFileSync(path.join(baseDir, fileName + '.html')).toString()
}

function createTemplates() {
    var _  = require('underscore'),
        meeting = loadFile('meeting'),
        schedule = loadFile('schedule'),
        call = loadFile('call'),
        email = loadFile('email'),
        options = { variable: 'd' };

    meetingTmpl = _.template(meeting, null, options);
    scheduleTmpl = _.template(schedule, null, options);
    callTmpl = _.template(call, null, options);
    emailTmpl = _.template(email, null, options);
}

function getTemplate(doc) {
    switch(doc.nextContact.type.toLowerCase()) {
        case 'meeting':
            return meetingTmpl;
        case 'call':
            return callTmpl;
        case 'email':
            return emailTmpl;
    }

    return scheduleTmpl;
}

function toHtml(doc) {
    var viewModel = toViewModel(doc),
        template = getTemplate(viewModel),
        html = template(viewModel);

    return html;
}

function toViewModel(doc) {

  var viewModel = doc,
      now = new Date,
      today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  viewModel.url = 'people/' + doc._id + '/followup';

  if(doc.nextContact) {
    var nextContact = doc.nextContact;
    if(nextContact.date) {
        var date = moment(nextContact.date);
        nextContact.dateString = date.format('MMM D');
        nextContact.timeString = date.format('h:mm A');
        if(date.toDate() < today) {
            viewModel.overdue = true;
        }
    }
  }

  if(Array.isArray(viewModel.phones)) {
    viewModel.phones.forEach(function(phone) {
        var type = phone.type || "Phone",
            abbreviation = type.charAt(0).toUpperCase();

        phone.abbreviation = abbreviation;
        phone.type = abbreviation + type.substring(1);
    });
  }
  
  return viewModel;
}

module.exports = Followups;