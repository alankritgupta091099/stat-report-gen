require('./DB/db.js');
require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var moment = require('moment');

var app = express();
app.use(cors());

app.use(bodyParser.json({limit: '5mb', extended: true}));
app.use(bodyParser.urlencoded({extended:true}));

//Import All Middlewares Here
const auth = require('./Middlewares/auth.js');
const Middlewares = [auth];

app.use(function (req,res,next) {    
    console.log("Request From ===>",req.url," @ ",moment().format('MMMM Do YYYY, h:mm:ss a'))
    next();
})

//Import all the route files here
//POST Routes
const webScraper=require('./Routes/POST/scraper.js');
const insta=require('./Routes/POST/insta.js');
const reportGen=require('./Routes/POST/report-gen.js');
const createUser=require('./Routes/POST/user.js');
const editCustomer=require('./Routes/POST/customers.js');
const toggleGeneratingReportButton=require('./Routes/POST/customers.js');
//GET routes
const verifyUser=require('./Routes/GET/user.js');
const fetchCustomers=require('./Routes/GET/customer.js');
const fetchCustomerHistory=require('./Routes/GET/customer.js');
const totalDocs=require('./Routes/GET/dashboardStats.js');
const calculateRevenue=require('./Routes/GET/dashboardStats.js');
const totalCustomers=require('./Routes/GET/dashboardStats.js');
const StatHistory7Days=require('./Routes/GET/dashboardStats.js');
const coveragesScanned=require('./Routes/GET/dashboardStats.js');

var PORT = process.env.PORT || 8080;

app.listen( PORT , ()=>{
    console.log("Server Listening to port ", PORT);
})

//Setup routes here
app.use('/scrap' , Middlewares , webScraper);
app.use( '/insta' , Middlewares , insta );
app.use('/report', Middlewares , reportGen);
//Post
app.use('/post/user',createUser);
app.use('/post/customer', Middlewares, editCustomer);
app.use('/post/customer', Middlewares, toggleGeneratingReportButton);
//Get
app.use('/get/user',verifyUser);
app.use('/get/customers', Middlewares, fetchCustomers);
app.use('/get/customer', Middlewares, fetchCustomerHistory);
app.use('/get/stats', Middlewares, totalDocs);
app.use('/get/stats', Middlewares, calculateRevenue);
app.use('/get/stats', Middlewares, totalCustomers);
app.use('/get/stats', Middlewares, StatHistory7Days);
app.use('/get/stats', Middlewares, coveragesScanned);