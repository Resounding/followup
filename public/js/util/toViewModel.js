var moment = require('moment');

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
        nextContact.dateTimeString = date.format('MMM d, YYYY h:mm A');
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

    if(!Array.isArray(viewModel.contacts)) {
        viewModel.contacts = [];
    }

    
    viewModel.contacts.forEach(function(contact) {
        var date = moment(contact.date);
        contact.dateTimeString = date.format('MMM d, YYYY h:mm A');
        var icon = 'icon-calendar';
        switch(contact.type) {
            case 'meeting':
                icon = 'icon-group';
                break;
            case 'call':
                icon = 'icon-phone';
                break;
            case 'email':
                icon = 'icon-envelope';
                break;
        }
        contact.icon = icon;
    });
  }
  
  return viewModel;
}

module.exports = toViewModel;