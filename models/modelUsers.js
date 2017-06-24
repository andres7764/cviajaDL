var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//User collection
usuarios = new mongoose.Schema({
    nombre:         { type: String },
    correo:         { type: String },
    cedula:         { type: Number },
    telefono:       { type: Number },
    fechaCreate:    { type: Date, default: new Date() },
});

module.exports = mongoose.model('usuariosmodel', usuarios);