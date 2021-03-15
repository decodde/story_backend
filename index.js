var express = require('express');
var app = express();
var server = require('http').createServer(app);
var PORT = 36904;
var { Router } = require("./routes/Router");
var { DBController } = require('./db/DBController');

app.use(require('body-parser')());
app.use(express.static(__dirname+"/public"));
app.set('views',__dirname+"/views");
//app.set('view engine', 'pug');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    res.header("Access-Control-Allow-Methods", "PUT,DELETE,POST,GET")
    next();
  });



app.post("/api/login",Router.login);
app.post("/api/onboard",Router.onboard);
app.post("/api/user/get",Router.user.get);
app.post("/api/story/delete", Router.story.delete);
app.post("/api/story/get", Router.story.get);
app.post("/api/story/create", Router.story.create);
app.post("/api/story/myStories", Router.story.myStories)
app.post("/api/story/newArrivals", Router.story.newArrivals),
app.post("/api/story/stories/all/light", Router.story.stories.light);
app.post("/api/story/stories/all/detailed", Router.story.stories.detailed);

app.get("/api/login",(req,res)=> res.json({type:"(^__^) hey there"}));
app.get("*",Router.nothing);

app.listen(process.env.PORT || PORT, () => {
    console.log("/==|===/ story loading....******")
})
