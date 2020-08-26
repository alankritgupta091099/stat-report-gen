var db = require('./DB/db.js');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Import all the route files here
const webScraper=require('./Routes/scraper.js');

var PORT = process.env.PORT || 3000;

db.connect((err)=>{
    if(err){
        console.log("unable to connect to db")
        process.exit(1);
    } else {
        app.listen( PORT , ()=>{
            console.log("Server Listening to port ", PORT);
            console.log("DB Connected")
        })
    }
})

//Setup routes here
app.use('/scrap',webScraper);