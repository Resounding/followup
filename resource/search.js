var util = require('util'),
    cons = require('consolidate'),
    toViewModel = require('../public/js/util/toViewModel'),
 	path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    baseDir = path.join(__dirname, '../public/tmpl/people'),
    personHtml = fs.readFileSync(path.join(baseDir, 'person.html')).toString(),
    personTemplate = _.template(personHtml, null, { variable: 'd' }),
    database;

function toHtml(doc) {
    var viewModel = toViewModel(doc),
    	html = personTemplate(viewModel);

    return html;
}

function Search(db) {
	database = db;
	return Search;
}

Search.index = function(req, res){
	var search = req.query.q || '',
		tag = req.query.tag || '';

	if(Array.isArray(search)) {
		search = search.join('');
	}

	var title = (search || tag) ? 'Searching ' : 'Search';
	if(search) {
		title += '"' + search + '"'
	}

	if(tag) {
		title += search ? ' with tag ' : ' tag ';
		title += '"' + tag + '"';
	}

	database.view('people/lastName', function(err, dbRes) {

		if(tag) {
			dbRes.forEach(function(row) {
				row.tags = row.tags || [];
				if(row.tags.indexOf(tag) === -1) {
					row.tags.push(tag);
				}
			})
		}

		var rows = dbRes.map(toHtml);

		res.render('people', {
			title: title,
			people: rows
		});  
	});  
};

module.exports = Search;