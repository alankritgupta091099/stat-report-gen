const mongoose = require ('mongoose');
const moment = require ('moment');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    orgName:{
        type:String,
        required:true
    },
    orgPosition:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobNumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        default:'Trial',
        required:true
    },
    validFrom:{
        type:Date,
        default:Date.now()
    },
    validUntil:{
        type:Date,
        default:moment(Date.now()).add(15,'days')
    },
    date:{
        type:Date,
        default:Date.now()
    }
},{ minimize: false });

module.exports = mongoose.model('User', userSchema);