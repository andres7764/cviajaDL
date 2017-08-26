var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//User collection
reservas = new mongoose.Schema({
    name:            {type: String},
    mail:            {type: String},
    idActivity:      {type: Schema.ObjectId, ref: 'activitiesmodel'},
    dateCreated:     {type: Date, default: new Date()},
    mount:           {type: Number},
    quantity:        {type: Number},
    codes:           {type: Array, default: []},
    typePayment:     {type: String},
    wasPayment:      {type: Boolean, default: false},
    statusPayment:   {type: String},
    codeTransaction: {type: String},
    dateReserv:      {type: String}
});

module.exports = mongoose.model('reservasmodel',reservas);