var mongoose = require('mongoose'),

//User collection
activities = new mongoose.Schema({
    name:                   { type: String  },
    distanceTime:           { type: String  },
    description:            { type: String  },
    legalInfo:              { type: String},
    isActive:               { type: Boolean },
    location:               { type: Object  },
    dateCreated:            { type: Date, default: new Date() },
    prefixCodes:            { type: String  },
    availablePersons:       { type: Number  },
    categories:             { type: String  },
    image:                  { type: String  },
    carousel:               { type: Array, default: []},
    url:                    { type: String  },
    mount:                  { type: Number  },
    organizationId:         { type: String  },
    options:                { type: Array, default: []},
    rnt:                    { type: String, default: ""  }, //Registro nacional de turismo
    imgRnt:                 { type: String, default: ""},
    msgConfirm:             { type: String, default: "Gracias por su compra" },
    order:                  { type: Number, default: 0}

}); 


module.exports = mongoose.model('activitiesmodel',activities);
