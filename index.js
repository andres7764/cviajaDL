//document.write();
// set up ==============================================================================
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var multipart = require('connect-multiparty');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var http = require('http').Server(app);
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

// configuration ======================================================================

mongoose.connect(config.db);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json({type: 'application/json'})); 
app.use(methodOverride());
app.use(cookieParser('DPlan'));
app.use(session({secret: '#Dplan56950fe494af8e88204adf6d', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(multipart());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.route('./config/routes');

require('./config/routes')(app);
require('./config/passport')();

// listen (start app with node server.js) ===========================================
//http.listen(8080, argv.fe_ip);
http.listen(config.port);
console.log('App listening on port 5500');