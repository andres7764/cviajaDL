require('../models/modelUsers');
var User = require('mongoose').model('usuariosmodel');

var mongoose = require('mongoose');
var encryption = require('../helpers/cripto');
var sendMail = require('../config/sendMail');

// *************************Usuarios ****************************************

exports.getUsuarios = function(req, res) {
    User.find({},function(err,users) {
        if (!err) return res.status(200).json({users: users});
        return res.status(500).json({err: err});
    });
};

exports.getUsuario = function(req, res) {
    User.findOne({'_id':mongoose.Types.ObjectId(req.query.id)},function(err, user) {
        if (!err) return res.status(200).json({user: user});
        return res.status(500).json({err: err});
    })
};

exports.updateUsuario = function(req, res) {
    User.findByIdAndUpdate({_id: req.body.id}, {$set: req.body.dataToUpdate}, function(err,updated) {
        if (!err) return res.status(200).json({user: updated});
        return res.status(500).json({err: err});
    });
};