var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rating = new Schema({
    id: { type: String },
    by: { type: String },
    score: { type: String },
    ratedWhen: { type: Date, default: new Date() }
});
module.exports = mongoose.model("Rating", rating);