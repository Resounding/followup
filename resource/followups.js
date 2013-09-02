var util = require('util'),
    cons = require('consolidate'),
    moment = require('moment'),
    database,
    toString = Object.prototype.toString;

function Followups(db) {
  database = db;
  return Followups;
}

Followups.index = function(req, res){
  database.view('people/followups', function(err, dbRes) {
  	console.log('followups view result: ' + util.inspect(dbRes));

    var rows = (Array.isArray(dbRes) ? dbRes : []).map(toViewModel);

    res.render('followups', {
      followups: rows
    });  
  });  
};

function toViewModel(doc) {

  var viewModel = doc,
      now = new Date,
      today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if(doc.nextContact) {
    var nextContact = doc.nextContact;
    if(nextContact.date) {
        var date = moment(nextContact.date);
        nextContact.dateString = date.format('DD-MMM-YYYY');
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