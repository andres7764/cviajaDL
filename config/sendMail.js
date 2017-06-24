var sg = require('sendgrid')('');

module.exports = {

    send: function(name, mail, mensaje) {
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
                    subject: 'Bienvenido a DPlan'
                }
                ],
                from: {
                    email: 'devjs.info@gmail.com'
                },
                content: [
                  {
                    type: 'text/html',
                    value: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><title>.: CViajaDeLujo:.</title></head><body><center><img src="https://cviajadelujo.now.sh/img/cviaja.png" style="width:80px;height:80px"></center>' +
                    '<p>Hola: ' + name + '</p><p style="text-align: justify">' + mensaje + '</footer></body></html>'
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
            console.log(' error por: ' + error.response.statusCode);
        });
    }
};
