require('../models/modelUsers');
var User = require('mongoose').model('usuariosmodel');

var service = require('./service');
var mongoose = require('mongoose');
var encryption = require('../helpers/cripto');
var sendMail = require('./sendMail');

// *************************Usuarios ****************************************

exports.SignupUsuarios = function(req, res) {
    var datos = req.body;
    User.count(function(err, cont) {
        User.findOne({correo: datos.correo},function (err, status) {
            if (!status) {
                datos.salt = encryption.generateSalt();
                datos.hashPass = encryption.generateHashedPassword(datos.salt, datos.pass);
                usuario = new User(datos);
                usuario.save(function (err, user) {
                    if (!err) {
                        var mensaje = 'Estamos muy felices que te hallas unido a <b> DPlan </b>, el mejor lugar para encontrar siempre esas'                + 'actividades unicas a menos de 2 horas de tu ubicación.';
                        sendMail.send(user.nombre, user.correo, mensaje);
                        res.status(200).json({token: service.createToken(user),status:true});
                    }else {
                        console.log(err);
                        res.status(500).json({status:false, info:'ErrorInesperado'})
                    }
                });
            }else {
                res.status(500).send({status:false,info:'ExisteUsuario'});
            }
        });
    });
};

exports.LoginUsuarios = function(req, res) {
    User.findOne({correo: req.body.correo}, function(err, user) {
        if (user) {
            if (user.authenticate(req.body.pass)) {
                res.status(200).json({status: true,token: service.createToken(user),data: user});
            }else{
                res.json({status: false, info: 'errPass'});
            }
        }else {
            res.json({status: false, info: 'NoExiste'});
        }
    });
};

exports.userAvailable = function (req, res) {
    if (req.body.correo !== undefined) {
        User.findOne({correo: req.body.correo}, function (err, available) {
            if (err) { return res.status(500).json({info:'Error: No se pudo realizar la consulta'}) }
            if (available !== null && available.correo.length > 3) {
                return res.status(201).json({info: 'Error: Correo en uso, intenta con otro'});
            } else { return res.status(200).json({info:'Correo disponible'}) }
        });
    } else {
        return res.status(500).json({info:'Error: Correo no válido'})
    }
}

// ************************** fin Usuarios ********************************************