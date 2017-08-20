var mongoose = require('mongoose'),
organizators = mongoose.model('organizatorInfo');

exports.createOrganizator = function(req, res) {
    var newOrganizator = new organizators(req.body);
        newOrganizator.save(function(err, newActivity) {
        if (!err) {
          if (!error) {return res.status(500).send({info: error}); }
          return res.status(200).send({info: 'Organizador Guardado'});
        }else {
            return res.status(500).send({info: err.message});
        }
    });
};