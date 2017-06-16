//document.write();
// set up ==============================================================================
	var express  = require('express');
	var app      = express();
	var mongoose = require('mongoose');
	var bodyParser = require('body-parser');
	var methodOverride = require('method-override');
//	var argv = require('optimist').argv;
  	var http = require('http').Server(app);

// configuration ======================================================================

	mongoose.connect('mongodb://35.184.69.152:80/cviaja');
 	//app.use('/public', express.static(__dirname + '/public'));
// 	app.use(cors());
 	app.use(express.static('public'));
 	//app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/photos" }));
 	app.use(express.static('/'));
 	app.use('/bower_components', express.static(__dirname + '/bower_components'));
	//app.use(morgan('dev')); 										// log every request to the console
	app.use(bodyParser.urlencoded({ extended : true})); 			// parse application/x-www-form-urlencoded
	app.use(bodyParser.json()); 									// parse application/json
	app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
	app.use(methodOverride());

//Include the models and controllers of the app =======================================
  require('./models/modelContact');
  require('./models/modelReservas');
  require('./models/modelActivities');

  var controllerContact = require('./controllers/controllerContact');
  var controllerReservas = require('./controllers/controllerReservas');
  var controllerActivities = require('./controllers/controllerActivities');

//Create routes by server rest API ====================================================
	app.post('/saveContact', controllerContact.saveContact);
	app.post('/saveReserva', controllerReservas.saveReserva);
	app.post('/cancelSuscription', controllerContact.cancelSuscription);
	app.post('/uploadActivities',controllerActivities.setActivities);
	app.post('/getActivities',controllerActivities.getActivities);
	app.get('/env',function(req,res){
})
// application ======================================================================
	app.get('/', function(req, res) {
		res.sendFile('index.html');
	});

  /*app.post('/saveContact',function(req,res){
    res.render('home.html');
  })*/

// listen (start app with node server.js) ===========================================
	//http.listen(8080, argv.fe_ip);
	http.listen(5500);
	console.log("App listening on port 5500");