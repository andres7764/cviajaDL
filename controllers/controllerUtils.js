require('../models/modelCount');
var Count = require('mongoose').model('countmodel');

var mongoose = require('mongoose');


// ************************* Count users ****************************************
exports.updateCount = function(req, res) {
    Count.update({}, {$inc: {views: 1}}, function(err,updated) {
        if (!err) {
            Count.find({},function(err,counts) {
                if (!err) {
                    return res.status(200).json({count: counts[0].views});
                }
                return res.status(500).json({err: err, count:  450});
            });
        }else {
            return res.status(500).json({err: err, count: 450});
        }
    });
};