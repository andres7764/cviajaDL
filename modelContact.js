var mongoose = require('mongoose'),
//User collection
contacto = new mongoose.Schema({
  nombre:             { type: String },
  correo:             { type: String },
  opciones:           { type: Object },
  suscribirseMail:    { type: Boolean},
  susCribirsePagos:   { type: Boolean},
  fecha:              { type: Date }
});
module.exports = mongoose.model('contactmodel',contacto)
