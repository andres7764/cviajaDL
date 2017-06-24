var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//User collection
reservasByUser = new mongoose.Schema({
  nombre:             { type: String },
  correo:             { type: String },
  event: 			  {	type: Schema.ObjectId, ref: "activitiesmodel"},
  fecha:              { type: Date, default: new Date() },
  quantity: 		  { type: Number },
  mount: 			  { type: Number }
});

module.exports = mongoose.model('reservasbyusermodel',reservasByUser);