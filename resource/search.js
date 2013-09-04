var util = require('util'),
    cons = require('consolidate'),
    database;

function Search(db) {
	database = db;
	return Search;
}

Search.index = function(req, res){
	var search = req.query.q || '',
		tag = req.query.tag || '';

	console.log('searching for ' + search + ', tag ' + tag);

	database.view('people/lastName', function(err, dbRes) {
		res.render('people', {
			people: dbRes
		});  
	});  
};

module.exports = Search;