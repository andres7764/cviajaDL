require('../models/modelUsers');
var User = require('mongoose').model('usuariosmodel');

//Autenticacion Apps
var authApps = require('./authSatellizer');
var middleware = require('./middleware');

//Include the models and controllers of the app =======================================
require('../models/modelContact');
require('../models/modelReservas');
require('../models/modelActivities');

var controllerContact = require('../controllers/controllerContact');
var controllerReservas = require('../controllers/controllerReservas');
var controllerActivities = require('../controllers/controllerActivities');

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

module.exports = function(app) {

    /* Generar contraseña */
    function generar(longitud)
    {
        var caracteres = 'abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789';
        var contraseña = '';
        for (i = 0; i < longitud; i++) contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        return contraseña;
    }

    //************************** APP *************************************
    app.post('/auth/SignupUsuarios', authApps.SignupUsuarios);
    app.post('/auth/LoginUsuarios', authApps.LoginUsuarios);


    //Create routes by server rest API ====================================================
    app.post('/saveContact', controllerContact.saveContact);
    app.post('/saveReserva', controllerReservas.saveReserva);
    app.post('/cancelSuscription', controllerContact.cancelSuscription);
    app.post('/uploadActivities',controllerActivities.setActivities);
    app.get('/getActivities',controllerActivities.getActivities);
    app.get('/getActivity',controllerActivities.getActivity);
    app.get('/env',function(req,res) {});



    // application ======================================================================
    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('*', function (req, res) {
        res.render('page_404');
    });
};