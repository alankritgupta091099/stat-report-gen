const mongoose = require ('mongoose');

const statSchema = new mongoose.Schema({
    site_name:{
        type:String,
        lowercase: true,
        required:true
    },
    dailyPageViews:{
        type:Number,
        required:true
    },
    dailyVisitors:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
},{ minimize: false });

module.exports = mongoose.model('Stat', statSchema);