var util = require('util'),
    cons = require('consolidate'),
    database;

function People(db) {
  database = db;
  return People;
}

People.index = function(req, res){
  database.view('people/lastName', function(err, dbRes) {        
      res.render('people', {
        people: dbRes
      });
  });  
};

People.new = function(req, res){
  res.render('people/new');
};

People.create = function(req, res){

  var doc = req.body,
      tags = req.body.tags? req.body.tags.split(',') : [];

  doc.tags = tags;

  console.log('original request: ' + util.inspect(req.body));
  console.log('document: ' + util.inspect(doc));

  database.save(doc, function(err, dbRes) {
    var id = dbRes._id;
    res.redirect('/');
  });
};

People.show = function(req, res){
  database.get(req.params.person, function(err, doc) {
    if(doc == null) {
      res.send(404);
    } else {
      res.render('people/show', doc);  
    }
  });
};

People.edit = function(req, res){
  database.get(req.params.person, function(err, doc) {
    res.render('people/edit', doc);
  });
};

People.update = function(req, res){
  var doc = req.body,
      id = req.params.person,
      rev = doc._rev;

  delete doc._rev;
  
  database.save(id, rev, doc, function(err, dbRes) {
    res.redirect('/people/' + id);
  }); 
};

People.destroy = function(req, res){
  var id = req.params.person,
      rev = req.body._rev;

  database.remove(id, rev, function() {
    res.redirect('/');
  });
};

People.followup = function(req, res){
	database.get(req.params.person, function(err, doc) {
    res.render('people/followup', doc);
  });
};

module.exports = People;