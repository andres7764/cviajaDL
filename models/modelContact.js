var mongoose = require('mongoose'),

//User collection
contacto = new mongoose.Schema({
  nombre:             { type: String, Default: "Suscripción" },
  correo:             { type: String },
  fecha:              { type: Date, default: new Date()},
  suscripcionActiva:  { type: Boolean, Default: true}
});


module.exports = mongoose.model('contactmodel',contacto);
