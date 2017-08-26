
//Autenticacion Apps
               require('../models/modelUsers');
var authApps = require('./authSatellizer');
var middleware = require('./middleware');
var User = require('mongoose').model('usuariosmodel');

//Include the models and controllers of the app =======================================
require('../models/modelContact');
require('../models/modelReservas');
require('../models/modelActivities');

var controllerContact = require('../controllers/controllerContact');
var controllerReservas = require('../controllers/controllerReservas');
var controllerActivities = require('../controllers/controllerActivities');
var controllerUsers = require('../controllers/controllerUsers');
var controllerAdmin = require('../controllers/controllerAdmin');
var controllerOrganizators = require('../controllers/controllerOrganizators')

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
    app.post('/auth/userAvailable',authApps.userAvailable);
    app.post('/updateUsuario',controllerUsers.updateUsuario);
    app.get('/getUsuarios',controllerUsers.getUsuarios);
    app.get('/getUsuario',controllerUsers.getUsuario);
    
    

    //Create routes by server rest API ====================================================
    app.post('/saveContact', controllerContact.saveContact);
    app.post('/cancelSuscription', controllerContact.cancelSuscription);
    app.post('/updateQtyActivity', controllerActivities.updateQtyActivity);

    // Activities
    app.post('/createActivity', controllerActivities.createActivity);
//    app.post('/uploadActivities',controllerActivities.setActivities);
    app.get('/getActivities',controllerActivities.getActivities);
    app.get('/getActivity',controllerActivities.getActivity);

    // Checkouts
    app.post('/saveBooking', controllerReservas.saveBooking);
    app.post('/updateReserva',controllerReservas.updateReserva);
    app.get('/getReservas',controllerReservas.getReservas);
    app.get('/getReserva',controllerReservas.getReserva);
    
    // Organizators
    app.post('/saveOrganizator',controllerOrganizators.createOrganizator);
    
    // Admin
    app.post('/LoginAdmin',controllerAdmin.LoginAdmin);

    // application web ======================================================================
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });
    
    // application admin
    app.get('/admin', function(req, res) {
        res.render('admin.ejs');
    });
    
    app.get('/login', function(req,res){
        res.render('login.ejs');
    });

    app.get('*', function (req, res) {
        res.send('page_404');
    });
};