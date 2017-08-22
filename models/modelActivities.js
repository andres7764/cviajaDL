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
    prefixCode:             { type: String  },
    availablePersons:       { type: Number  },
    categories:             { type: String  },
    carousel:               { type: Array, default: []},
    url:                    { type: String  },
    exitBy:                 { type: String  },
    city:                   { type: String  },
    detailplan:             { type: String  },
    mount:                  { type: Number  },
    organizationId:         { type: String  },
    order:                  { type: Number, }
}); 


module.exports = mongoose.model('activitiesmodel',activities);
