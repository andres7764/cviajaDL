var mongoose  =  require('mongoose');
var ObjectId  = mongoose.Schema.ObjectId;
var activities =  mongoose.model('activitiesmodel');

//POST - Insert a new user in the Collection
exports.getActivities = function(req, res) {
    activities.find(function(err, activities) {
        if(err) { return res.status(500).send(err.message); }
           return res.status(200).send({activities: activities});
    });
};

exports.getActivity = function(req, res) {
    activities.find({"_id":mongoose.Types.ObjectId(req.query.id)},function(err, activity) {
        if(err) { return res.status(500).send(err.message); }
        return res.status(200).send({activity:activity});
    });
};

exports.setActivities = function(req, res) {
 var newActivity = new activities({
  name:                req.body.name,
  distanceTime:        req.body.distance,
  description:    	   req.body.description,
  isActive:    		   req.body.active,
  location: 		   req.body.location,
  dateCreated:         req.body.date,
  mount: 			   req.body.mount,
  prefixDiscountCodes: req.body.discCodes,
  availablePersons:    req.body.avlPerson,
  categories:    	   req.body.categories,
  image: 			   req.body.image
 });
    newActivity.save(function(err, newActivity) {
        if(err) { return res.status(500).send(err.message); }
           return res.status(200).send({token: "Actividad Guardada"});
    });
}