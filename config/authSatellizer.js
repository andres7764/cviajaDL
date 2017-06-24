require('../models/modelUsers');
var User = require('mongoose').model('usuariosmodel');

var service = require('./service');
var mongoose = require('mongoose');

// *************************Usuarios ****************************************
exports.SignupUsuarios = function(req, res) {
    var datos = req.body;
    User.count(function(err, cont) {
      User.findOne({correo: datos.mail},function (err, status) {
          if (err) {
             console.log('Error general');
          }else if (!status) {
                 datosAux = mapeoDatosUser(datos,cont);
                   usuario = new User(datosAux);
                   usuario.save(function (err, obj) {
                  if (!err) {
                      var Mensaje = '<h1> Bienvenid@ a BoxoTaxi </h1> <br> <p>Ahora podrás pedir un taxi seguro y confiable.' +
                                    '</p><p>Si desea contactar con nosotros escribenos a info@boxo.com.co</p>';
                      //envioCorreos(obj.correo,Mensaje);
                      res.status(200).json({token: service.createToken(obj),status:true});
                   }else {
                     console.log(err);
                      res.status(200).json({status:false, info:'ErrorInesperado'})
                   }
                 });
          }else {
             console.log('El dato ya existe');
             res.status(200).send({status:false,info:'ExisteUsuario'});
          }
       }); 
   });
};

exports.LoginUsuarios = function(req, res) {
    User.findOne({correo: req.body.username}, function(err, user) {
        if (user) {
            if (user.pass === req.body.password) {
              res.status(200).json({status: true,token: service.createToken(user),data: user});
            }else if (user.pass !== req.body.pass) {
              res.json({status: false, info: "errPass"});
            }
        }else{
          res.json({status: false, info: "NoExiste"});
        }
    });
};

exports.userAvailable = function (req, res) {
  if(req.body.correo !== undefined){
    User.findOne({correo: req.body.correo}, function (err, available){
     if (err) { return res.status(500).json({info:"Error: No se pudo realizar la consulta"}) }
      if (available !== null && available.correo.length > 3){
        return res.status(201).json({info: "Error: Correo en uso, intenta con otro"});
       } else { return res.status(200).json({info:"Correo disponible"}) }
    });
   } else {
    return res.status(500).json({info:"Error: Correo no válido"})
  }
}

// ************************** fin Usuarios ********************************************