const mongoose = require ('mongoose');
const moment = require ('moment');

const coverageSchema = new mongoose.Schema({ count: Number , time: Date },{ _id : false });

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
    plan:{
        cost:{
            type:Number,
            default:0
        },
        validFrom:{
            type:Date,
            default:Date.now()
        },
        validUntil:{
            type:Date,
            default:moment(Date.now()).add(15,'days')
        }
    },
    coveragesScanned:{
        type:[coverageSchema]
    },
    docsCreated:{
        type: Number,
        default:0
    },
    date_created:{
        type:Date,
        default:Date.now()
    }
},{ minimize: false });

module.exports = mongoose.model('User', userSchema);