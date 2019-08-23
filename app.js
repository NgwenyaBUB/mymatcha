//Node.js ==> Express Framework (SIMPLE SERVER)
const express = require("express");
let app = express();
//Port to listen on
const PORT = 3000;

const path = require("path");

const bodyParser = require("body-parser");

const bootstrap = require("./src/boostrap");

const ejs = require('ejs');
const session = require('express-session');

//Use a Custom Templating Engine
app.set("view engine", "ejs");

app.set("views", path.resolve("./src/views"));

app.use(session({secret: 'ssshhhhh', cookie: {secure: false}, resave: false,saveUninitialized: true}));

//Request Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Create Express Router
const router = express.Router();
app.use(router);

const rootPath = path.resolve("./dist");
app.use(express.static(rootPath));
var sess;

bootstrap(app, router);

//Main Page (Home)
router.get("/", (req, res, next) => {
  sess = req.session;
  sess.username = "myname its";
  // return res.send("Hello There");
  return res.render('index');
});

router.use((err, req, res, next) => {
  if (err) {
    //Handle file type and max size of image
    return res.send(err.message);
  }
});

app.listen(PORT, err => {
  if (err) return console.log(`Cannot Listen on PORT: ${PORT}`);
  console.log(`Server is Listening on: http://localhost:${PORT}/`);
});
