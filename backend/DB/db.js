const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGO_URL || 'mongodb://localhost:27017/klaviyo-demo',{ useNewUrlParser:true , useUnifiedTopology: true })
    .then(()=>{console.log('DB Connected')})
    .catch(err=>{console.log(err)})