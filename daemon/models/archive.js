var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var archiveSchema = new Schema({
    id: Number,
    type: String,
    link: String,
    count: Number,
    title: String,
    read: Boolean,
    date: { type: Date, default: Date.now  },
    update: { type: Date },
    notify: Boolean
}, {collection: 'archive'});

module.exports = mongoose.model('archive', archiveSchema);
