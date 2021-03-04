var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var story = new Schema({
    id: { type: String },
    content: { type: String },
    by : {type : String},
    created : {type : Date , default : new Date()},
    openedTimes : {type : Number, default : 0},
    readBy : {type : Array},
    visibility : {type : String, default : "public"}
});
module.exports = mongoose.model("Story", story);