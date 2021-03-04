var { Response } = require("../misc/Response");
var { Constants } = require("../misc/Constants");
var { DBController } = require("../db/DBController");
var Router = {
    login: async (req, res) => {
        console.log("..")
        var { username, password } = req.body;
        res.json(await DBController.user.login(username, password));
    },
    onboard: async (req, res) => {
        res.json(await DBController.user.signup(req.body));

    },
    verifyEmail: async (req, res) => {

    },
    story: {
        delete: async (req, res) => {
            var { authorization } = req.headers;
            var verify = await DBController.misc.verifyApiKey(authorization);
            if (verify.type == "success") {
                var { id } = req.body;
                res.json(await DBController.story.delete(id, verify.user))
            }
            else {
                res.json(Response.error(Constants.STORY_DELETE_FAILED, Constants.AUTH_FAILED));
            }
        },
        /*
        get : async (req,res) => {
            var {id,pass} = req.body;
            res.json(await DBController.story.get(id,pass));
        }*/
        get: async () => {
            return new Promise((resolve, reject) => {

            })
        }
        ,
        create: async () => {
            var { authorization } = req.headers;
            var verify = await DBController.misc.verifyApiKey(authorization);
            if (verify.type == "success") {
                res.json(await DBController.story.create(user, req.body))
            }
        },
        myStories: async (req, res) => {
            var { user } = req.body;
            var { authorization } = req.headers;
            var verify = await DBController.misc.verifyApiKey(authorization);
            res.json(await DBController.story.myStories(verify.user, user));
        }
    },
    nothing: async (req, res) => {
        res.json({ type: "Welcome ", msg: "Story, story.. Once upon a time............" });
    }
}

exports.Router = Router;