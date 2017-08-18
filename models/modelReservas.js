var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//User collection
reservas = new mongoose.Schema({
    name:            {type: String},
    mail:            {type: String},
    idActivity:      {type: Schema.ObjectId, ref: 'activitiesmodel'},
    dateCreated:     {type: Date, default: new Date()},
    quantity: 	     {type: Number},
    mount:           {type: Number},
    codes: 		     {type: Object},
    typePayment:     {type: String},
    wasPayment:      {type: Boolean, default: false},
    statusPayment:   {type: String},
    codeTransaction: {type: String},
    dateReserv:      {type: String},
    options:         {type: Array, default: []}
});

module.exports = mongoose.model('reservasmodel',reservas);