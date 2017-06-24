var mongoose  =  require('mongoose');
var ObjectId  = mongoose.Schema.ObjectId;
require('../models/modelReservas');
require('../models/modelReservasByUser');
require('../models/modelUsers');
var reserva =  mongoose.model('reservasmodel');
var reservaByUser = mongoose.model('reservasbyusermodel');
var User = mongoose.model('usuariosmodel');

var sendMail = require('../config/sendMail');
var mensaje = 'Gracias por reservar con nosotros, <p>DPlan</p> el mejor lugar para estar al tanto de las actividades unicas que puedes'                        + 'realizar a menos de 2 horas de tu ubicación';
//POST - Insert a new user in the Collection
exports.saveReserva = function(req, res) {
    var newReserv = new reserva(req.body);
    newReserv.save(function(err, newreserva) {
        if (err) { return res.status(500).send(err.message); }
        addReservation(req.body.correo, newreserva, function(next) {
            if (!next) {
                sendMail.send(req.body.nombre, req.body.correo, mensaje);
                return res.status(200).send({token: 'Reserva creada correctamente, te contactaremos para confirmar tu reserva'});
            }else {
                return res.status(500).send(next);
            }
        });

    });
};

exports.getReservas = function(req, res) {
    reserva.find({},function(err, reservas) {
        if (!err) return res.status(200).json({reservas: reservas});
        return res.status(500).json({err: err});
    })
};

exports.getReserva = function(req, res) {
    reserva.findOne({'_id':mongoose.Types.ObjectId(req.query.id)},function(err, reserva) {
        if (!err) return res.status(200).json({reserva: reserva});
        return res.status(500).json({err: err});
    })
};

exports.updateReserva = function(req, res) {
    reserva.findByIdAndUpdate({_id: req.body.id}, {$set: req.body.dataToUpdate}, function(err,updated) {
        if (!err) return res.status(200).json({reserva: updated});
        return res.status(500).json({err: err});
    });
};

//Helpers
function addReservation(correo, reserva, next) {
    User.findOne({correo: correo},function(err,user) {
        if (!err && user) {
            var reservaBy = new reservaByUser({user:user._id, reserva: reserva._id});
            reservaBy.save(function(err,newreserby) {
                if (err) next(err);
                next(null);
            });
        }
    })

}
