var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boxSchema = new Schema({
    columns: Number,
    title: String,
    date: {
        type: Date,
        default: Date.now
    },
    boxes: Number
});

module.exports = boxSchema;
