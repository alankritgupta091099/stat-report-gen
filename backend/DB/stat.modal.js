const mongoose = require ('mongoose');

const lastVisitedSchema = new mongoose.Schema({ visitor_id: String , visitor_time: Date });

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
    lastVisited:{
        type:[lastVisitedSchema]
    },
    creator:{
        type:String,
        required:true
    },
    date_creation:{
        type:Date,
        default:Date.now()
    }
},{ minimize: false });

module.exports = mongoose.model('Stat', statSchema);