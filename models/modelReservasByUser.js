var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//User collection
reservasByUser = new mongoose.Schema({
    user:      {type: Schema.ObjectId, ref: 'usuariosmodel'},
    reserva:    {type: Schema.ObjectId, ref: 'reservasmodel'}
});

module.exports = mongoose.model('reservasbyusermodel',reservasByUser);