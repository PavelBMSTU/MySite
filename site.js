var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var bodyParser = require('body-parser');

var app = express();



var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var handlebars = require('express-handlebars').create ({
	defaultLayout: 'main',
	helpers: {
           section: function(name, options){
               if(!this._sections) this._sections = {};
               this._sections[name] = options.fn(this);
               return null;
} }
});
app.engine('handlebars', handlebars.engine); 
app.set('view engine', 'handlebars');//указываем модель (инструмент) представления
//app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

function getWeatherData(){
    return {
        locations: [
            {
                name: 'Портленд',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Сплошная облачность ',
                temp: '54.1 F (12.3 C)',
            }, 
            {
            name: 'Бенд',
            forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
            iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
            weather: 'Малооблачно',
            temp: '55.0 F (12.8 C)',
            }, 
            {
            name: 'Манзанита',
            forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
            iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
            weather: 'Небольшой дождь',
            temp: '55.0 F (12.8 C)',
            }, 
            ],
}; 
}
function getWeathernowData(){
    return {
        locations: [
            {
                name: 'Портленд',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Сплошная облачность ',
                temp: '54.1 F (12.3 C)',
            }, 
            {
            name: 'Бенд',
            forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
            iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
            weather: 'Малооблачно',
            temp: '55.0 F (12.8 C)',
            }, 
            {
            name: 'Манзанита',
            forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
            iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
            weather: 'Небольшой дождь',
            temp: '55.0 F (12.8 C)',
            }, 
            ],
}; 
}
app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weatherContext = getWeatherData();
    next();
});
app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weathernowContext = getWeathernowData();
    next();
});
app.get('/', function(req, res) {
	res.render('home');
});
app.get('/how', function(req, res) {
	res.render('how');
});
app.get('/compare', function(req, res) {
	res.render('compare');
});
app.get('/weather', function(req, res) {
	res.render('weathernow');
});
app.get('/artists', function(req, res) {

	db.collection('artists').find().toArray(function(err, docs) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		res.send(docs);
	});
});

app.post('/artists', function(req, res) {
	var artist = {
		name: req.body.name
	};

	db.collection('artists').insertOne(artist, function(err, result) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
		}
		res.send(artist);
	});
});
app.get('artists/:id', function(res, req) {
	db.collection('artists').findOne({id: ObjectID(req.params.id) }, function(err, doc) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		res.send(doc);
	});
});
app.put('artists/:id', function(res, req) {
	db.collection('artists').updateOne(
		{ id: ObjectID(req.params.id) },
		{ name: req.body.name },
		function(err, result) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}
			res.sendStatus(200);
		}
		)
	});
app.delete('artists/:id', function(res, req) {
	db.collection('artists').deleteOne(
		{ id: ObjectID(req.params.id) },
		function(err, result) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}
			res.sendStatus(200);
		}
		)
	});

/*app.listen(app.get('port'), function(){
    console.log( 'Express запущен на http://localhost:' +
      app.get('port') + '; нажмите Ctrl+C для завершения.' );


});
*/
app.use(function(req, res, next) {
	res.status(404);
	res.render('404');
});
app.use(function(req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

MongoClient.connect('mongodb://localhost:27017/', function (err, database) {
if (err) {
	return console.log(err);
}
db = database.db('mydb');
app.listen(3012, function() {
	console.log('API app started');
});
});



