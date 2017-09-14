var mongoose  =  require('mongoose');
var ObjectId  = mongoose.Schema.ObjectId;
var Activities =  mongoose.model('activitiesmodel');

//POST - Insert a new user in the Collection
exports.getActivities = function(req, res) {
    Activities.find({isActive: true},'name description mount url categories location',function(err, activities) {
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

exports.updateQtyActivity = function(req,res) {
    Activities.update({_id: req.body.id}, {$set: {options: req.body.obj}},function(err, response) {
        if (err) { return res.status(500).send(err.message); }
        return res.status(200).send({token:'actividad actualizada correctamente'});
    });
};

//Helpers
function assingUrl(id, cb) {
    var urlBase = 'https://dplan.co/catalogo/#!/catalogo/' + id;

    Activities.update({_id: id}, {$set: {url: urlBase}},function(err, response) {
        if (err) { cb({err: err}); }
        cb({err: null});
    });
}