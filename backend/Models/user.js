const jwt = require('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const User = require('../DB/user.modal.js');

module.exports = {    
    createUser,
    loginUser,
    getUserFromToken
}

// @route POST /post/user/reg
// @desc Create New User
// @access --------Pending

function createUser(req,res){
    const { firstName , email , lastName , orgName , orgPosition , mobNumber , password } = req.body;

    if( !firstName || !email || !lastName || !orgName || !orgPosition || !mobNumber || !password){
        return res.status(400).json({msg:'Please enter all fields'})
    }

    const userData= new User({ 
        firstName , email , lastName , orgName , orgPosition , mobNumber , password 
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
// @access --------Pending

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
                jwt.sign(
                    { id:user.id , email:user.email },
                    process.env.SECRET_KEY,
                    //{ expiresIn: 3600 }, //expiry of auth token
                    (err,token)=>{
                        if(err) throw err
                        res.json({
                            token,
                            user
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