const User = require('../DB/user.modal.js');

module.exports = {
    fetchCustomers,
    editCustomer
}

function fetchCustomers (req,res) {
    try {
        User
            .find({accountType:{$ne:'Admin'}})
            .select('-password')
            .then((userList) => {
                return res.status(200).json(userList);
            }).catch((err) => {
                return res.status(400).json({msg: 'Something Went Wrong'});
            });
    } catch (error) {
        return res.status(400).json({msg: 'Something Went Wrong'})
    }
}

function editCustomer(req,res) {
    try {
        console.log(req.params.id)
        User
            .findOneAndUpdate({_id:req.params.id},{
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email,
                orgName:req.body.orgName,
                orgPosition:req.body.orgPos,
                mobNumber:req.body.phone,
                accountType:req.body.type,
                validFrom:req.body.validFrom,
                validUntil: req.body.validUntil
            }, {new:true})
            .then((result) => {
               console.log(result);
               return res.status(200).json({msg: 'User Updated'}); 
            }).catch((err) => {
                return res.status(400).json({msg: 'Something Went Wrong'});
            });
    } catch (error) {
        return res.status(400).json({msg: 'Something Went Wrong'})
    }
}