const jwt = require('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const User = require('../DB/user.modal.js');
const moment = require('moment');
var nodemailer = require('nodemailer');

module.exports = {    
    createUser,
    loginUser,
    getUserFromToken,
    forgotPassword,
    resetPassword,
    checkResetPasswordRoute
}

// @route POST /post/user/reg
// @desc Create New User
// @access PRIVATE

function createUser(req,res){
    const { firstName , email , lastName , orgName , orgPosition , mobNumber , password , type , cost , limit , validFrom } = req.body;

    if( !firstName || !email || !lastName || !orgName || !orgPosition || !mobNumber || !password || !type || !limit || !validFrom){
        return res.status(400).json({msg:'Please enter all fields'})
    }

    const userData= new User({ 
        firstName , email , lastName , orgName , orgPosition , mobNumber , password , accountType:type , plan: {cost , limit , validFrom , limitLeft:limit }
    })
    User.findOne({
        email
    })
    .then(user => {
        if(!user){
            bcrypt.hash(password,10,(err,hash)=>{
                userData.password=hash;
                console.log(userData)
                userData
                    .save()
                    .then(user=>{
                        return res.status(200).json({status:user.email+' Registered!!'})
                    })
                    .catch(err=>{
                        return res.status(400).json({msg: 'Something Went Wrong'})
                    })
            })
        }else{
            return res.status(409).json({msg:'User already exists'});
        }
    }).catch((err) => {
        return res.status(400).json({msg:'Something Went Wrong'});
    });
}

// @route POST /post/user/login
// @desc Login User and assign token
// @access PUBLIC

function loginUser(req,res){
    const { email , password } = req.body;

    if( !email || !password){
        res.status(400).json({msg:'Please enter all fields'})
    }

    User.findOne({
        email
    })
    .then((user) => {
        if(!user) 
            return res.status(400).json({msg:"User Does Not Exist"})
        bcrypt.compare(password,user.password)
            .then((isMatch) => {
                if(!isMatch) 
                    return res.status(400).json({msg:"Invalid Credentials"})
                //var x = user;
                delete(user["password"])
                console.log()
                jwt.sign(
                    { id:user.id , email:user.email },
                    process.env.SECRET_KEY,
                    //{ expiresIn: 3600 }, //expiry of auth token
                    (err,token)=>{
                        if(err) throw err
                        res.json({
                            token,
                            user:{
                                _id:user.id,
                                firstName:user.firstName,
                                lastName:user.lastName,
                                email:user.email,
                                accountType:user.accountType,
                                orgName:user.orgName,
                                orgPosition:user.orgPosition,
                                mobNumber:user.mobNumber,
                                date:user.date,
                                plan:user.plan
                            }
                        })
                    }
                )    
            }).catch((err) => {
                return res.status(400).json({msg: 'Something Went Wrong'})
            });
    }).catch((err) => {
        return res.status(400).json({msg:'Something Went Wrong!!'});
    });
}

// @route POST /post/user/forgot
// @desc Login User and assign token
// @access PUBLIC

function forgotPassword(req,res) {
    const { email } = req.body;
    if( !email ){
        res.status(400).json({msg:'Please enter your registered email id'})
    }
    User.findOne({
        email
    })
    .then((user) => {
        if(!user) 
            return res.status(400).json({msg:"User Does Not Exist"})
        var payload = {
            id: user._id,
            email: email
        };
        var secret = `${user.password}-${moment(user.date_created).format('x')}`;
        var token = jwt.sign(payload, secret);
        var text = 'Dear User,\n\n You are receiving this because we have received a request to reset the password this account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:3000/resetpassword/'+payload.id+"/"+token+ '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        sendMail(text,"Reset your password",email)
        return res.status(200).json({msg:"Password reset link successfully sent to the registered email id"})
    }).catch((err) => {
        return res.status(400).json({msg:'Something Went Wrong!!'});
    });
}

// @route POST /post/user/reset
// @desc Login User and assign token
// @access PUBLIC
function resetPassword(req,res) {
    const { values , userId , token } = req.body;
    User.findOne({
        _id:userId
    })
    .then((user) => {
        if(!user) 
            return res.status(400).json({msg:"User Does Not Exist"})
        var secret = `${user.password}-${moment(user.date_created).format('x')}`;
        var payload = jwt.verify(token, secret);
        if(payload.email===user.email)
        bcrypt.hash(values.password,10,(err,hash)=>{
            console.log(hash)
            user.password=hash;
            user
                .save()
                .then(user=>{
                    return res.status(200).json({msg:"Password updated"})
                })
                .catch(err=>{
                    return res.status(400).json({msg: 'Something Went Wrong'})
                })
        })
    }).catch((err) => {
        return res.status(400).json({msg:'Something Went Wrong!!'});
    });
}

// @route POST /post/user/checkReset
// @desc Login User and assign token
// @access PUBLIC
function checkResetPasswordRoute(req,res) {
    const { userId , token } = req.body;
    User.findOne({
        _id:userId
    })
    .then((user) => {
        console.log(user)
        if(!user) 
            return res.status(400).json({msg:"User Does Not Exist"})
        var secret = `${user.password}-${moment(user.date_created).format('x')}`;
        var payload = jwt.verify(token, secret);
        if(payload.email===user.email)
            return res.status(200).json({msg:"Valid Route"})
        else 
            return res.status(200).json({msg:"Invalid Route"})
    }).catch((err) => {
        return res.status(400).json({msg:'Something Went Wrong!!'});
    });
}

// @route GET /get/user/fromToken
// @desc gets user details from token
// @access Private

function getUserFromToken(req,res){
    try {
        console.log(req.user)
        User
        .findById(req.user.id)
        .select('-password')
        .then(user=>{
            res.status(200).json(user);
        })   
    } catch (error) {
        res.status(400).json({msg:"Something went wrong"})
    }    
}

function sendMail(text,subject,email) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASS
        }
    });

    var mailOptions = {
        from: `"Get Measurements" <${process.env.MAIL_ID}>`,
        to: email,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent to: ' + mailOptions.to,' Info: ', info);                   
        }
    });
}