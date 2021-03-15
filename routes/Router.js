var { Response } = require("../misc/Response");
var { Constants } = require("../misc/Constants");
var { DBController } = require("../db/DBController");
var Router = {
    login: async (req, res) => {
        var { username, password } = req.body;
        res.json(await DBController.user.login(username, password));
    },
    onboard: async (req, res) => {
        res.json(await DBController.user.onboard(req.body));
    },
    verifyEmail: async (req, res) => {

    },
    user : {
        get : async (req,res) => {
            var { authorization } = req.headers;
            var verify = await DBController.misc.verifyApiKey(authorization);
            if (verify.type == "success") {
                var {username} = req.body;
                res.json(await DBController.user.get(username))
            }
            else {
                res.json(Response.error(Constants.PROFILE_RETRIEVAL_FAIL,Constants.AUTH_FAILED));
            }
        },
        myProfile : async (req,res) => {
            var { authorization } = req.headers;
            var verify = await DBController.misc.verifyApiKey(authorization);
            if (verify.type == "success") {
                res.json(await DBController.user.get(verify.username))
            }
            else {
                res.json(Response.error(Constants.PROFILE_RETRIEVAL_FAIL,Constants.AUTH_FAILED));
            }
        }
    },
    story: {
        newArrivals : async (req,res) => {
            res.json(await DBController.story.newArrivals());
        },
        delete: async (req, res) => {
            var { authorization } = req.headers;
            var verify = await DBController.misc.verifyApiKey(authorization);
            if (verify.type == "success") {
                var { id } = req.body;
                res.json(await DBController.story.delete(id, verify.username))
            }
            else {
                res.json(Response.error(Constants.STORY_DELETE_FAILED, Constants.AUTH_FAILED));
            }
        },
        get : async (req,res) => {
            var {id,pass} = req.body;
            try {
                res.json(await DBController.story.get(id,pass));
            }
            catch(e) {
                res.json(Response.error(Constants.DB_ERROR));
            }
        },
        create: async (req,res) => {
            var { authorization } = req.headers;
            var verify = await DBController.misc.verifyApiKey(authorization);
            if (verify.type == "success") {
                res.json(await DBController.story.create(verify.data, req.body))
            }
            else {
                res.json(Response.error(Constants.STORY_CREATION_FAILED,Constants.AUTH_FAILED));
            }
        },
        myStories: async (req, res) => {
            var { user } = req.body;
            var { authorization } = req.headers;
            var verify = await DBController.misc.verifyApiKey(authorization);
            res.json(await DBController.story.myStories(verify.username, user));
        },
        stories : {
            light : async (req,res) => {
                var {perPage} = req.body;
                res.json(await DBController.story.all.light(perPage));
            },
            detailed : async () => {
                var {perPage} = req.body;
                res.json(await DBController.story.all.detailed(perPage));
            }
        }
    },
    nothing: async (req, res) => {
        res.json({ type: "Welcome ", msg: "Story, story.. Once upon a time............" });
    }
}

exports.Router = Router;