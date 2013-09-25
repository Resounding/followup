var express = require('express'),
	cons = require('consolidate'),
	Resource = require('express-resource'),
	app = express();

app.engine('html', cons.underscore);

app.set('view engine', 'html');
app.set('views', __dirname + '/../public/tmpl');

app.use(express.methodOverride());

module.exports = app;