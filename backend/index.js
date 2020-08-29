require('./DB/db.js');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Import all the route files here
const webScraper=require('./Routes/scraper.js');
const insta=require('./Routes/GET/insta.js');

var PORT = process.env.PORT || 3000;

app.listen( PORT , ()=>{
    console.log("Server Listening to port ", PORT);
})

//Setup routes here
app.use('/scrap',webScraper);
app.use('/insta',insta);