var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
require('../models/modelReservas');
require('../models/modelOrganizators');
require('../models/modelUsers');
require('../models/modelActivities')
var reserva = mongoose.model('reservasmodel');
var reservaByUser = mongoose.model('organizatorInfo');
var User = mongoose.model('usuariosmodel');
var Activities = mongoose.model('activitiesmodel');
var sendMail = require('../config/sendMail');
var mensaje = 'Gracias por adquirir tu plan con nosotros, <p>DPlan</p> el mejor lugar para estar al tanto de las actividades unicas que puedes realizar a menos de 2 horas de tu ubicación';

exports.saveBooking = function(req, res) {
    console.log(req.body);
	saveBooking(req.body, function(result) {
		console.log(result);
		if (!result.err) {
			return res.status(200).send(result);
		} else {
			return res.status(500).send(result);
		}
	});
};

exports.getReservas = function(req, res) {
	reserva.find({}).populate('event', 'name').exec(function(err, reservas) {
		if (!err) return res.status(200).json({
			reservas: reservas
		});
		return res.status(500).json({
			err: err
		});
	});
};

exports.getReserva = function(req, res) {
	reserva.findOne({
		'_id': mongoose.Types.ObjectId(req.query.id)
	}, function(err, reserva) {
		if (!err) return res.status(200).json({
			reserva: reserva
		});
		return res.status(500).json({
			err: err
		});
	});
};

exports.updateReserva = function(req, res) {
	reserva.findByIdAndUpdate({
		_id: req.body.id
	}, {
		$set: req.body.dataToUpdate
	}, function(err, updated) {
		if (!err) return res.status(200).json({
			reserva: updated
		});
		return res.status(500).json({
			err: err
		});
	});
};

//Helpers
function addReservation(correo, reserva, next) {
	User.findOne({
		correo: correo
	}, function(err, user) {
		if (!err && user) {
			var reservaBy = new reservaByUser({
				user: user._id,
				reserva: reserva._id
			});
			reservaBy.save(function(err, newreserby) {
				if (err) next({
					err: true,
					message: err
				});
				next(null);
			});
		}
	});
};

function saveBooking(objectReserv, cb) {
	var newReserv = new reserva(objectReserv);
	newReserv.save(function(err, newreserva) {
			if (err) {
				cb({
					err: true,
					message: err.message
				});
			} else {
				addReservation(objectReserv.correo, newreserva, function(next) {
					if (objectReserv.status === 'Aceptada') {
						createMail(newreserva, function(msg) {
                            mensaje += msg;
							sendMail.send(objectReserv.nombre, objectReserv.correo, mensaje);
							cb({
								err: false,
								message: 'Reserva creada correctamente, te contactaremos para confirmar tu reserva'
							});
						});

					} else {
						cb({
							err: true,
							message: 'Compra rechazada'
						});
					}

				});
		}
	});
};

function createMail(reserva, cb) {
	var msg = '<br><h3>Detalles de tu compra</h3>';
	var defaultMsg = '<br><p>Tu compra fue exitosa en minutos te haremos llegar tu plan</p>';
	Activities.findOne({
		'_id': reserva.event
	}, function(err, activity) {
        console.log(activity);
		if (!err) {
			msg += activity.msgConfirm ? activity.msgConfirm : defaultMsg;
			cb(msg);
		} else {
			msg += defaultMsg;
			cb(msg);
		}
	});
};
