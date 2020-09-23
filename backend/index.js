require('./DB/db.js');
require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')

var app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Import All Middlewares Here
const auth = require('./Middlewares/auth.js');
const Middlewares = [auth];

app.use(function (req,res,next) {
    console.log("Request From ===>",req.url," @ ",Date(Date.now()).toString())
    next();
})

//Import all the route files here
//POST Routes
const webScraper=require('./Routes/POST/scraper.js');
const insta=require('./Routes/POST/insta.js');
const reportGen=require('./Routes/POST/report-gen.js');
const createUser=require('./Routes/POST/user.js');
//GET routes
const verifyUser=require('./Routes/GET/user.js');

var PORT = process.env.PORT || 8080;

app.listen( PORT , ()=>{
    console.log("Server Listening to port ", PORT);
})

//Setup routes here
app.use('/scrap' , Middlewares , webScraper);
app.use( '/insta' , Middlewares , insta );
app.use('/report', Middlewares , reportGen);
app.use('/post/user',createUser);
app.use('/get/user',verifyUser);