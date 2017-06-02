var mongoose = require('mongoose'),

//User collection
reservas = new mongoose.Schema({
  nombre:             { type: String },
  correo:             { type: String },
  event: 			  {	type: String },
  fecha:              { type: Date, default: new Date() }
});

module.exports = mongoose.model('reservasmodel',reservas);