var mongoose  =  require('mongoose');
var ObjectId  = mongoose.Schema.ObjectId;
var reserva =  mongoose.model('reservasmodel');

//POST - Insert a new user in the Collection
exports.saveReserva = function(req, res) {
    var newReserv = new reserva(req.body);
    newReserv.save(function(err, newUser) {
        if(err) { return res.status(500).send(err.message); }
           return res.status(200).send({token: "Reserva creada correctamente, te contactaremos para confirmar tu reserva"});
    });
};
