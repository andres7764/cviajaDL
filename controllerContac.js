var mongoose  =  require('mongoose');
var ObjectId  = mongoose.Schema.ObjectId;
var contacto =  mongoose.model('contactmodel');
//POST - Insert a new user in the Collection
exports.saveContact = function(req, res) {
    console.log(req.body);
    var newUser = new contacto({
        nombre:             req.body.nombre,
        correo:             req.body.correo,
        opciones:                   req.body.opciones,
        suscribirseMail:  req.body.suscribirseMail,
        susCribirsePagos: req.body.suscribirsePagos,
        fecha:                        req.body.fecha
    });
    newUser.save(function(err, newUser) {
        if(err) { return res.status(500).send(err.message); }
           return res.status(200).send({token: "Te has registrado correctamente, Gracias!"});
    });
};
