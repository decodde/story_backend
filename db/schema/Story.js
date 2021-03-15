var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var story = new Schema({

    id: { type: String },
    content: { type: String },
    by: { type: String },
    author : {type : String},
    created: { type: Date, default: new Date() },
    openedTimes: { type: Number, default: 0 },
    readBy: { type: Array },
    lastEdited: { type: Date, default: new Date() },
    visibility: { type: String, default: "public" },
    title : {type : String}
});
module.exports = mongoose.model("Story", story);