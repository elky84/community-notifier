var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var archiveSchema = new Schema({
    id: Number,
    type: String,
    link: String,
    count: Number,
    title: String,
    date: { type: Date, default: Date.now  }
}, {collection: 'archive'});

module.exports = mongoose.model('archive', archiveSchema);