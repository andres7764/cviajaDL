var mongoose = require('mongoose'),

//Count collection
counts = new mongoose.Schema({
    views: {type: Number, default: 450}
});

module.exports = mongoose.model('countmodel',counts);
