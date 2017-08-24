var mongoose  =  require('mongoose');
var ObjectId  = mongoose.Schema.ObjectId;
var contacto =  mongoose.model('contactmodel');

//POST - Insert a new user in the Collection
exports.saveContact = function(req, res) {
    var newUser = new contacto(req.body);
    newUser.save(function(err, newUser) {
        if(err) { return res.status(500).send(err.message); }
           return res.status(200).send({token: "Hemos guardado tu correo ahora estarás informado de todos los planes que carguemos para ti"});
    });
}

exports.cancelSuscription = function(req,res) {
 contacto.update({correo: req.body.correo},{suscripcionActiva: false},function(err,resp){
      if(err) { return res.status(500).send(err.message); }
           return res.status(200).send({token: "Haz quedado fuera de nuestra suscripción"});
 })
}

function sendMail(name, mail,random) {

var sg = require('sendgrid')("");
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: {
    personalizations: [
      {
        to: [
          {
            email: mail
          }
        ],
        subject: 'Bienvenido a Dplan'
      }
    ],
    from: {
      email: 'contacto@dplan.co'
    },
    content: [
      {
        type: 'text/html',
        value: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><title>.: Dplan:.</title></head><body><center><img src="http://dplan.co/img/dplan.png" style="width:80px;height:80px"></center>'+
        '<p>Hola: ' +name+'</p><p style="text-align: justify">Estamos muy contentos de que hayas realizado tu suscripción, es por eso que te obsequiamos el siguiente código de descuento para redimirlo este fin de semana en la cascada el escobo en Vergara Cundinamarca (a 90 minutos de Bogotá) con <a href="https://m.facebook.com/story.php?story_fbid=1461940603869756&id=100001614916762" target="_blank">la ruta del tigre</a></p><p>Tu código de descuento es: <b>'+random+'</b></p><br><p>- El código de descuento es de $10.000 pesos y aplica únicamente para parejas.<br>- Promoción válida del 6 al 11 de Junio de 2017</p><hr><P>Cordialmente</P><p>El equipo CViajaDeLujo</p><footer><center>Si ya no deseas seguir recibiendo correos haz click <a href="http://dplan.co" target="_blank">aquí</a></center></footer></body></html>'
      }
    ]
  }
});

// With promise
sg.API(request)
  .then(function (response) {
    console.log(response.statusCode);
  })
  .catch(function (error) {
    console.log(" error por: "+error.response.statusCode);
  });

}
