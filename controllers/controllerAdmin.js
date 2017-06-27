require('../models/modelUsers');
var User = require('mongoose').model('usuariosmodel');

var service = require('../config/service');
var mongoose = require('mongoose');
var encryption = require('../helpers/cripto');

exports.LoginAdmin = function(req, res) {
    User.findOne({correo: req.body.correo}, function(err, user) {
        if (user) {
            if (user.authenticate(req.body.pass) && user.rol === 10) {
                res.status(200).json({status: true,token: service.createToken(user),data: user});
            }else{
                var msg = user.rol !== 10 ? 'rolInvalido' : 'errPass';
                res.json({status: false, info: msg}); 
            }
        }else {
            res.json({status: false, info: 'NoExiste'});
        }
    });
};