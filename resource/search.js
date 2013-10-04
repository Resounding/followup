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
    var viewModel = toViewModel(doc);
	
	viewModel.url = 'people/' + doc._id + '/edit';

	var html = personTemplate(viewModel);

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

		var rows = [];
		
		dbRes.forEach(function(row) {			

			row.tags = row.tags || [];

			if(tag) {
				if(row.tags.indexOf(tag) === -1) {
					row.tags.push(tag);
				}
			}

			if(search) {
				var searchKey = search.toLowerCase();
				if(row.firstName.toLowerCase().indexOf(searchKey) === -1 &&
					row.lastName.toLowerCase().indexOf(searchKey) === -1 &&
					row.organization.toLowerCase().indexOf(searchKey) === -1 &&
					row.address.city.toLowerCase().indexOf(searchKey) === -1) {

					return;
				}
			}

			var html = toHtml(row);
			rows.push(html);
		});

		res.render('people', {
			title: title,
			people: rows,
			search: search,
			tag: tag
		});  
	});  
};

module.exports = Search;