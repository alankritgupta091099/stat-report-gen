const moment = require('moment');
const User = require('../DB/user.modal.js');

module.exports = {
    totalDocs,
    calculateRevenue
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

function calculateRevenue(req,res) {
    try {
        var today = moment().format();      
        var startOfMonth = moment().startOf('month');
        var endOfMonth   = moment().endOf('month');   
        var totalCost=0;             
        User
            .find({
                "accountType":"Paid",
                "plan.validFrom":{$lte:today},
                "plan.validUntil":{$gt:today}
            })
            .then((userList) => {        
                console.log(userList)        
                for (let i = 0; i < userList.length; i++) {
                    const user = userList[i];
                    console.log(user)
                    var until = moment(user.plan.validUntil);
                    var from = moment(user.plan.validFrom);
                    console.log("total days",until.diff(from,'days'));
                    var numDays = 0;
                    var costPerDay = user.plan.cost/until.diff(from,'days');
                    console.log("cost per day", costPerDay)
                    if(moment(until).isBetween(startOfMonth,endOfMonth) && moment(from).isBetween(startOfMonth,endOfMonth)){//when both dates lie in current month
                        console.log(from,until)
                        numDays = until.diff(from,'days');
                    }else if (moment(until).isBetween(startOfMonth,endOfMonth)) {//when only upperlimit of the date lie in current month
                        console.log(startOfMonth,until,endOfMonth)
                        numDays = until.diff(startOfMonth,'days')
                    } else if(moment(from).isBetween(startOfMonth,endOfMonth)){//when only lowerlimit of the date lie in current month
                        console.log(startOfMonth,from,endOfMonth)
                        numDays = endOfMonth.diff(from,'days')
                    } else {//when none of the date lie in current month
                        console.log(startOfMonth,endOfMonth)
                        numDays = endOfMonth.diff(startOfMonth,'days')
                    }
                    console.log("number of days", numDays)
                    totalCost+=numDays*costPerDay;
                }
                return res.status(200).json(Math.round(totalCost * 10) / 10);
            }).catch((err) => {
                return res.status(400).json({msg: 'Something Went Wrong'});
            });
    } catch (error) {
        return res.status(400).json({msg: 'Something Went Wrong'})
    }
}