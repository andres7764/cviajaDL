var mongoose = require('mongoose'),

//User collection
activities = new mongoose.Schema({
  name:                { type: String  },
  distanceTime:        { type: String  },
  description:    	   { type: String  },
  isActive:    		     { type: Boolean },
  location: 		       { type: Object  },
  dateCreated:         { type: Date, default: new Date() },
  mount: 			         { type: Number  },
  prefixDiscountCodes: { type: String  },
  availablePersons:    { type: Number  },
  categories:    	     { type: String  },
  image:               { type: String  }
});


module.exports = mongoose.model('activitiesmodel',activities);