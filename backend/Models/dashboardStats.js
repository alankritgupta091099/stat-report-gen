const User = require('../DB/user.modal.js');

module.exports = {
    totalDocs
}

function totalDocs(req,res) {
    try {
        User
            .find({})
            .then((userList)=>{
                var totalDocs = 0;
                for (let i = 0; i < userList.length; i++) {
                    totalDocs+=userList[i].docsCreated
                }
                return res.status(200).json(totalDocs);
            })
            .catch(()=>{
                return res.status(400).json({msg: 'Something Went Wrong'});
            })    
    } catch (error) {
        return res.status(400).json({msg: 'Something Went Wrong'})
    }
}