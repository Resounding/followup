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
        nextContact.dateTimeString = date.format('MMM d, YYYY h:mm a');
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

module.exports = toViewModel;