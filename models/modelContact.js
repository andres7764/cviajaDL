var mongoose = require('mongoose'),

//User collection
contacto = new mongoose.Schema({
  name:               { type: String, default: "Suscripción" },
  mail:               { type: String },
  date:               { type: Date, default: new Date()},
  activeSubscription: { type: Boolean, default: true},
  description: 		  { type: String },
  phone: 			  { type: String }
});


module.exports = mongoose.model('contactmodel',contacto);
