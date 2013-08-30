var util = require('util'),
    cons = require('consolidate'),
    database;

function People(db) {
  database = db;
  return People;
}

People.index = function(req, res){
  db.view('people/lastName', function(err, rows) {
    res.render('people', {
      rows: rows
    });  
  })
  
};

People.new = function(req, res){
  res.render('people/new');
};

People.create = function(req, res){
  db.save(req.body, function(err, dbRes) {
    var id = dbRes._id;
    res.redirect('/people/' + id);
  });
};

People.show = function(req, res){
  db.get(req.params.person, function(err, doc) {
    res.render('people/show', doc);  
  });
};

People.edit = function(req, res){
  db.get(req.params.person, function(err, doc) {
    res.render('people/edit', doc);
  });
};

People.update = function(req, res){
  var doc = req.body,
      id = req.params.person,
      rev = doc._rev;

  delete doc._rev;
  
  db.save(id, rev, doc, function(err, dbRes) {
    res.redirect('/people/' + id);
  }); 
};

People.destroy = function(req, res){
  res.send('destroy person ' + req.params.person);
};

People.followup = function(req, res){
	res.send('person followup ' + req.params.person + '!');
};

module.exports = People;