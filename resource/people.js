var util = require('util'),
    cons = require('consolidate'),
    _ = require('underscore'),
    toViewModel = require('../public/js/util/toViewModel'),
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
    database.view('people/tags', function(tagsErr, dbRes) {
        
        var tags = dbRes.map(function(tag) {
            return "'" + tag + "'";
        });
        tags = _.uniq(tags).join(',');
        
        res.render('people/new', {
            tags: tags
        });
    });
};

People.create = function(req, res){

  var doc = req.body || { },
      tags = doc.tags? doc.tags.split(',') : [];

  doc.tags = tags;

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
  var doc = req.body || req.query,
      id = req.params.person,
      rev = doc._rev;

  delete doc._rev;
  
  database.save(id, rev, doc, function(err, dbRes) {
    res.redirect('/people/' + id);
  }); 
};

People.destroy = function(req, res){
  var id = req.params.person,
      body = req.body || req.query,
      rev = body._rev;

  database.remove(id, rev, function() {
    res.redirect('/');
  });
};

People.followup = function(req, res){

     database.view('people/tags', function(tagsErr, dbRes) {

        function addQuote(tag) {
            return "'" + tag + "'";
        }

        var all_tags = _.uniq(dbRes.map(addQuote)).join(',');

        database.get(req.params.person, function(err, doc) {

            var tags = (doc.tags || []).join(',');
            doc.all_tags = all_tags;
            doc.tags = tags;

            var viewModel = toViewModel(doc);

            res.render('people/followup', viewModel);            
        });
    });
};

People.recordContact = function(req, res) {    

    database.get(req.params.person, function(err, doc) {

        var id = doc._id,
            body = req.body || req.query,
            tags = body.tags || [];

        doc.tags = tags.split(',');

        doc.contacts = doc.contacts || [];
        doc.contacts.push(body.contact);

        body.nextContact = body.nextContact || {};
        body.nextContact.confirmed = !!body.nextContact.confirmed;
        doc.nextContact = body.nextContact;
        
        database.save(id, doc, function(err, dbRes) {
            if(err) {
                console.log('Error saving: ' + util.inspect(err));
                res.send(500);
            } else {
                res.redirect('/');
            }
        });
    });
};

module.exports = People;