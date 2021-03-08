const { Response } = require("../misc/Response");
const { Constants } = require("../misc/Constants");
var mongoose = require('mongoose');
const crypt = require("crypto");
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
    }
});


var Schema = mongoose.Schema;
require("./schema/Story");
require("./schema/User");

if (process.env.NODE_ENV == 'production') {
    require('dotenv').config();
    var mongodbURL = process.env.MONGODB_URL || 'mongodb+srv://railosapp:mongo@railos-vkklb.mongodb.net/ninchat';
}
else if (process.env.NODE_ENV == 'development') {
    var mongodbURL = 'mongodb://localhost:27017/story';
}
else {
    mongodbURL = process.env.MONGODB_URL || 'mongodb+srv://railosapp:mongo@railos-vkklb.mongodb.net/ninchat';
}

try {
    mongoose.connect(mongodbURL);
} catch (error) {
    throw error;
}
var Story = mongoose.model("Story");
var User = mongoose.model("User");

const DBController = {
    misc: {
        generateStoryId: async (storyName) => {
            try {
                var mykey = crypt.createCipheriv('aes-256-gcm', "id");
                var mystr = mykey.update(storyName, 'utf8', 'hex');
                mystr += mykey.final('hex');
                return mystr;
            }
            catch (e) {
                console.log(e.code);
                return null;
            }
        },
        sendMail: async (who, where, subject, body) => {
            var mailOptions = {
                from: 'story@gmail.com',
                to: where,
                subject: subject,
                text: body
            };
            return new Promise((resolve, reject) => {
                try{
                    transporter.sendMail(mailOptions, async (error, info) => {
                        if (error) {
                            console.log(Object.keys(error));
                            resolve(Response.error(Constants.EMAIL_SENT_FAIL,error));
                        } else {
                            console.log('Email sent: ' + info.response);
                            resolve(Response.success(Constants.EMAIL_SENT_SUCCESS));
                        }
                    });
                }
                catch(e){
                    console.log(e);
                    resolve(Response.error(Constants.EMAIL_SENT_FAIL,e));
                }
            })
        },
        decodeStoryId: async (id) => {
            try {
                var mykey = crypt.createDecipher('aes-128-cbc', "id");
                var mystr = mykey.update(id, 'hex', 'utf8')
                mystr += mykey.final('utf8');
                return mystr
            }
            catch (e) {
                console.log(e.code);
                return null;
            }
        },
        decodeApiKey: async (apiKey) => {
            try {
                var mykey = crypt.createDecipher('aes-128-cbc', Constants.SALT);
                var mystr = mykey.update(apiKey, 'hex', 'utf8')
                mystr += mykey.final('utf8');
                return mystr
            }
            catch (e) {
                console.log(e.code);
                return null;
            }
        },
        verifyApiKey: async (apiKey) => {
            var dec = await DBController.misc.decodeApiKey(apiKey);
            var user = "";
            dec != null ? user = dec : "";
            var userCheck = await DBController.user.usernameExist(user);
            userCheck.username = user;
            return userCheck;
        },
        generateApiKey: async (username) => {
            try {
                var mykey = crypt.createCipheriv('aes-128-cbc', Constants.SALT);
                var mystr = mykey.update(username, 'utf8', 'hex');
                mystr += mykey.final('hex');
                return mystr;
            }
            catch (e) {
                console.log(e.code);
                return null;
            }
        },
        hashPassword: async (password) => {
            try {
                var mykey = crypt.createCipheriv('aes-128-cbc', Constants.SALT);
                var mystr = mykey.update(password, 'utf8', 'hex');
                mystr += mykey.final('hex');
                return mystr;
            }
            catch (e) {
                console.log(e.code);
                return null;
            }
        }

    },
    user: {
        onboard: async (details) => {
            var { username, email, password, name } = details;
            if (username && email && password && name) {
                /*not sure if  i should avoid capitals ; anyways */
                username = username.toLowerCase();
                var usernameExists = await DBController.user.usernameExist(username);
                if (usernameExists.type == "error") {
                    password = await DBController.misc.hashPassword(password);
                    var apiKey = await DBController.misc.generateApiKey(username);
                    var emailDetails = await Constants.EMAIL.SIGNUP(username);
                    var sndMail = await DBController.misc.sendMail(username, email, emailDetails.subject, emailDetails.body);
                    if (process.env.NODE_ENV == "production" && sndMail.type == "error"){
                        return Response.error(Constants.SIGNUP_FAILED,Constants.EMAIL_INVALID);
                    }
                    else{
                        var _user = new User();
                        _user.name = name;
                        _user.username = username;
                        _user.email = email;
                        _user.password = password;
                        _user.joined = new Date();
                        _user.apiKey = apiKey;
                        try {
                            _user.save();
                            return Response.success(Constants.SIGNUP_SUCCESS, { apiKey: apiKey, username: username });
                        }
                        catch (e) {
                            console.log(e);
                            return Response.success(Constants.SIGNUP_FAILED, Constants.DB_ERROR);
                        }
                    }
                }
                else {
                    return Response.error(Constants.SIGNUP_FAILED, Constants.USERNAME_EXISTS);
                }
            }
            else {
                var failed = username ? (email ? (password ? "" : "password") : "email") : "username";
                return Response.error(Constants.SIGNUP_FAILED, `${failed} field is missing`);
            }
        },
        getAll: async () => {
            try {
                var _req = await User.find();
                return Response.success(Constants.USERNAME_RETRIEVAL_SUCCESS, _req);
            }
            catch (e) {
                console.log(e);
                return Response.error(Constants.DB_ERROR, e);
            }
        },
        get: async (username) => {
            try {
                var _req = await User.findOne({ username: username });
                if (_req == null) {
                    return Response.error(Constants.USERNAME_NOT_EXISTS);
                }
                else {
                    delete _req.password;
                    delete _req.apiKey;
                    return Response.success(Constants.USERNAME_RETRIEVAL_SUCCESS, _req);
                }
            }
            catch (e) {
                console.log(e);
                return Response.error(Constants.DB_ERROR, e);
            }
        },
        usernameExist: async (username) => {
            var _req = await User.findOne({ username: username });
            if (_req == null) {
                return Response.error(Constants.USERNAME_NOT_EXISTS);
            }
            else return Response.success(Constants.USERNAME_EXISTS);
        },
        login: async (username, password) => {
            var _req = await User.findOne({ username: username });
            if (_req != null) {
                var hashPwd = await DBController.misc.hashPassword(password);
                if (_req.password == hashPwd) {
                    delete _req.password;
                    return Response.success(Constants.LOGIN_SUCCESS, _req);
                }
                else {
                    return Response.error(Constants.LOGIN_FAILED);
                }
            }
            else {
                return Response.error(Constants.LOGIN_FAILED);
            }
        }
    },
    story: {
        search : async () => {

        },
        myStories: async (currentUser, user) => {
            try {
                var stories = await Story.find({ by: user });
                return Response.success(Constants.STORY_RETRIEVAL_SUCCESS, stories);
            }
            catch (e) {
                console.log(e);
                return Response.error(Constants.DB_ERROR);
            }
        },
        create: async (user, storyDetails) => {
            var { visibility, content, title } = storyDetails;
            visibility ? ((visibility == "public" || visibility == "private") ? visibility : visibility = "public" ) : visibility = "public";
            content ? content : content = Constants.EMPTY_STORY;
            if (title) {
                var storyId = await DBController.misc.generateStoryId(title);
                var _story = new Story();
                _story.visibility = visibility;
                _story.content = content;
                _story.title = title;
                _story.id = storyId;
                _story.by = user;
                _story.created = new Date();
                _story.lastEdited = new Date();
                _story.readBy = [];
                _story.openedTimes = 0;
                try {
                    _story.save();
                    return Response.success(Constants.STORY_CREATION_SUCCESS,{id : storyId});
                }
                catch (e) {
                    console.log(e);
                    return Response.error(Constants.STORY_CREATION_FAILED, Constants.DB_ERROR);
                }
            }
            else {
                return Response.error(Constants.STORY_CREATION_FAILED, Constants.NO_TITLE);
            }
        },
        get: async (id, pass) => {
            try {
                var _req = await Story.findOne({ id: id });
                if (_req == null) {
                    return Response.error(Constants.STORY_ID_NOT_EXISTS);
                }
                else {
                    if (_req.visibility == "public") {
                        return Response.success(Constants.STORY_RETRIEVAL_SUCCESS, _req);
                    }
                    else {
                        if (pass == _req.pass) {
                            return Response.success(Constants.STORY_RETRIEVAL_SUCCESS, _req);
                        }
                        else {
                            return Response.error(Constants.STORY_INACCESSIBLE, Constants.STORY_AUTH_FAILED);
                        }
                    }
                }
            }
            catch (e) {
                console.log(e);
                return Response.error(Constants.DB_ERROR, e);
            }
        },
        all : {
            light : async () => {
                try {
                    var _req = await Story.find({_id : 0,content: 0});
                    return Response.success(Constants.STORY_RETRIEVAL_SUCCESS, _req);
                }
                catch (e) {
                    console.log(e);
                    return Response.error(Constants.DB_ERROR, e);
                }
            },
            detailed : async () => {
                try {
                    var _req = await Story.find();
                    return Response.success(Constants.STORY_RETRIEVAL_SUCCESS, _req);
                }
                catch (e) {
                    console.log(e);
                    return Response.error(Constants.DB_ERROR, e);
                }
            }
        },
        getAll: async () => {
            try {
                var _req = await Story.find();
                return Response.success(Constants.STORY_RETRIEVAL_SUCCESS, _req);
            }
            catch (e) {
                console.log(e);
                return Response.error(Constants.DB_ERROR, e);
            }
        },
        delete: async (id) => {
            try {
                var _req = await Story.findOne({ id: id });
                if (_req == null) {
                    return Response.error(Constants.STORY_ID_NOT_EXISTS);
                }
                else {
                    try {
                        var _req = await Story.deleteOne({ id: id });
                        console.log(_req);
                        return Response.success(Constants.STORY_DELETE_SUCCESS);
                    }
                    catch (e) {
                        console.log(e);
                        return Response.error(Constants.DB_ERROR, e);
                    }
                }
            }
            catch (e) {
                console.log(e);
                return Response.error(Constants.DB_ERROR, e);
            }
        }
    }

}


/*   
    /***-***\
    |<*>_<*>|
   (|  _|_  |)
    \  _~_  /
     \_____/
  _____| |_____
 |             |
 |  _          |
 |  |
*/
//https://www.whogohost.com/host/modules/gateways/paystack/paystackrecurring.php?name=Ayodele%20Faiyetole&whmcs=https://www.whogohost.com/host/&authcode=AUTH_b9ploinivz&amount=1000.00&customerEmail=ayodele.faiyetole@gmail.com&invoice=757158&mcheck=840953559BD5E394A574683C6CF38FD8
exports.DBController = DBController;