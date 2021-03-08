var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user = new Schema({
    joined: { type: Date },
    username: { type: String },
    password: { type: String },
    apiKey: { type: String },
    name: { type: String },
    email : {type : String}
});
module.exports = mongoose.model("User", user);