var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var encryption = require('../helpers/cripto');
//User collection
var usuarios = new mongoose.Schema({
    nombre:         { type: String },
    correo:         { type: String },
    cedula:         { type: Number },
    telefono:       { type: Number },
    fechaCreate:    { type: Date, default: new Date() },
    salt:           { type: String },
    hashPass:       { type: String },
    notification:   { type: Boolean, default: true }
});

usuarios.method({
      authenticate: function(password) {
       if (encryption.generateHashedPassword(this.salt, password) === this.hashPass) {
              return true;
          }
          else {
              return false;
          }
      }
  });

module.exports = mongoose.model('usuariosmodel', usuarios);