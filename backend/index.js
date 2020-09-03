require('./DB/db.js');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Import all the route files here
const webScraper=require('./Routes/GET/scraper.js');
const insta=require('./Routes/GET/insta.js');
const reportGen=require('./Routes/GET/report-gen.js');

var PORT = process.env.PORT || 8080;

app.listen( PORT , ()=>{
    console.log("Server Listening to port ", PORT);
})

//Setup routes here
app.use('/scrap',webScraper);
app.use('/insta',insta);
app.use('/report',reportGen);