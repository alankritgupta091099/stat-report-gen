const User = require('../DB/user.modal.js');

module.exports = {
    fetchCustomers
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