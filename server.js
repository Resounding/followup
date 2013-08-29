var express = require('express'),
	cons = require('consolidate'),
	Resource = require('express-resource'),
	app = express(),
	port = process.env.PORT || 3000;

app.engine('html', cons.underscore);

app.set('view engine', 'html');
app.set('views', __dirname + '/public/tmpl');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
require('./config/routes')(app);

app.listen(port);
console.log('Listening on port ' + port);