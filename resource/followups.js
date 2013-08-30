var util = require('util'),
    cons = require('consolidate'),
    database;

function Followups(db) {
  database = db;
  return Followups;
}

Followups.index = function(req, res){
  database.view('people/lastName', function(err, dbRes) {
    res.render('followups', {
      people: dbRes
    });  
  });  
};

module.exports = Followups;