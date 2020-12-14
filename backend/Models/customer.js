const User = require('../DB/user.modal.js');
const moment = require('moment');

module.exports = {
    fetchCustomers,
    editCustomer,
    fetchCustomerHistory
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

function editCustomer(req,res) {//limitLeft set to 0 after reset account
    try {
        User
            .findOne({_id:req.params.id})
            .then((result) => {
                var count=0;
                for (let i = 0; i < result.coveragesScanned.length; i++) {
                    const element = result.coveragesScanned[i];
                    if(!moment(element.time).isBefore(req.body.validFrom))
                        count+=element.count
                }
                result.firstName=req.body.firstName,
                result.lastName=req.body.lastName,
                result.email=req.body.email,
                result.orgName=req.body.orgName,
                result.orgPosition=req.body.orgPos,
                result.mobNumber=req.body.phone,
                result.accountType=req.body.type,
                result.plan = {
                    cost:req.body.cost,
                    validFrom:req.body.validFrom,
                    validUntil: req.body.validUntil,
                    limitLeft:req.body.limit-count,
                    limit:req.body.limit,
                }
                result.save();
                return res.status(200).json({msg: 'User Updated'}); 
            }).catch((err) => {
                return res.status(400).json({msg: 'Something Went Wrong'});
            });
    } catch (error) {
        return res.status(400).json({msg: 'Something Went Wrong'})
    }
}

function fetchCustomerHistory (req,res) {
    try {
        User
            .findOne({_id:req.params.id})
            .select('-password')
            .then((user) => {
                var arrToSend = [];
                user.coveragesScanned.forEach(coverage => {
                    if(!moment(coverage.time).isBefore(user.plan.validFrom))
                        arrToSend.push(coverage)
                });
                return res.status(200).json(arrToSend);
            }).catch((err) => {
                return res.status(400).json({msg: 'Something Went Wrong'});
            });
    } catch (error) {
        return res.status(400).json({msg: 'Something Went Wrong'})
    }
}
