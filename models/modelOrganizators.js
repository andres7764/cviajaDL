var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//User collection
organizatorInfo = new mongoose.Schema({
    nameOrganization:  {type: String},
    personContact:     {type: String},
    phoneCOntact:      {type: String},
    mailContact:       {type: String},
    codeRNT:           {type: String},
    imgCodeRNT:        {type: String}
});

module.exports = mongoose.model('organizatorInfo',organizatorInfo);