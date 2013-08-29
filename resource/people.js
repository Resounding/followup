var cons = require('consolidate');

exports.index = function(req, res){
  res.render('people');
};

exports.new = function(req, res){
  res.render('people/new');
};

exports.create = function(req, res){
  res.send('create person');
};

exports.show = function(req, res){
  res.render('people/show', {
  	id: req.params.person
  });
};

exports.edit = function(req, res){
  res.render('people/edit', {
  	id: req.params.person
  });
};

exports.update = function(req, res){
  res.send('update person ' + req.params.person);
};

exports.destroy = function(req, res){
  res.send('destroy person ' + req.params.person);
};

exports.followup = function(req, res){
	res.send('person followup ' + req.params.person + '!');
};