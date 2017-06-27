var mongoose  =  require('mongoose');
var ObjectId  = mongoose.Schema.ObjectId;
var Activities =  mongoose.model('activitiesmodel');

//POST - Insert a new user in the Collection
exports.getActivities = function(req, res) {
    Activities.find(function(err, activities) {
        if (err) { return res.status(500).send(err.message); }
        return res.status(200).send({activities: activities});
    });
};

exports.getActivity = function(req, res) {
    Activities.find({'_id':mongoose.Types.ObjectId(req.query.id)},function(err, activity) {
        if (err) { return res.status(500).send(err.message); }
        return res.status(200).send({activity:activity});
    });
};

exports.setActivities = function(req, res) {
    var newActivity = new Activities({
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
        if (err) { return res.status(500).send(err.message); }
        return res.status(200).send({token: 'Actividad Guardada'});
    });
};

exports.createActivity = function(req, res) {
    var newActivity = new Activities(req.body);

    newActivity.save(function(err, newActivity) {
        if (!err) {
            assingUrl(newActivity._id, function(error) {
                if (!error) {return res.status(500).send({info: error}); }
                return res.status(200).send({info: 'Actividad Guardada'});
            });
        }else {
            return res.status(500).send({info: err.message});
        }
    });
};

exports.updateQty = function(req,res) {
    Activities.update({_id: req.body.id}, {$set: {availablePersons: req.body.qty}},function(err, response) {
        if (err) { return res.status(500).send(err.message); }
        return res.status(200).send({token:'actividad guardada correctamente'});
    });
};

//Helpers
function assingUrl(id, cb) {
    var urlBase = 'http://cviajadelujo.devjs.co/catalogo/#!/catalogo/' + id;

    Activities.update({_id: id}, {$set: {url: urlBase}},function(err, response) {
        if (err) { cb({err: err}); }
        cb({err: null});
    });
}