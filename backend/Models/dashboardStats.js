const moment = require('moment');
const User = require('../DB/user.modal.js');
const Stat = require('../DB/stat.modal.js');

module.exports = {
    totalDocs,
    calculateRevenue,
    totalCustomers,
    StatHistory7Days
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
                //console.log(userList)        
                for (let i = 0; i < userList.length; i++) {
                    const user = userList[i];
                    //console.log(user)
                    var until = moment(user.plan.validUntil);
                    var from = moment(user.plan.validFrom);
                    //console.log("total days",until.diff(from,'days'));
                    var numDays = 0;
                    var costPerDay = user.plan.cost/until.diff(from,'days');
                    //console.log("cost per day", costPerDay)
                    if(moment(until).isBetween(startOfMonth,endOfMonth) && moment(from).isBetween(startOfMonth,endOfMonth)){//when both dates lie in current month
                        //console.log(from,until)
                        numDays = until.diff(from,'days');
                    }else if (moment(until).isBetween(startOfMonth,endOfMonth)) {//when only upperlimit of the date lie in current month
                        //console.log(startOfMonth,until,endOfMonth)
                        numDays = until.diff(startOfMonth,'days')
                    } else if(moment(from).isBetween(startOfMonth,endOfMonth)){//when only lowerlimit of the date lie in current month
                        //console.log(startOfMonth,from,endOfMonth)
                        numDays = endOfMonth.diff(from,'days')
                    } else {//when none of the date lie in current month
                        //console.log(startOfMonth,endOfMonth)
                        numDays = endOfMonth.diff(startOfMonth,'days')
                    }
                    //console.log("number of days", numDays)
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

function totalCustomers(req,res) {
    try {
        var paid = trial = expired = 0;
        User
            .find({accountType:{$ne:'Admin'}})
            .then((result) => {
                result.forEach(cust => {
                    if(cust.accountType==="Paid") 
                        paid+=1
                    else if (cust.accountType==="Trial") 
                        trial+=1
                    else 
                        expired+=1
                });
                return res.status(200).json({paid,trial,expired});
            }).catch((err) => {
                return res.status(400).json({msg: 'Something Went Wrong'})
            });
    } catch (error) {
        return res.status(400).json({msg: 'Something Went Wrong'})
    }
}

function StatHistory7Days(req,res) {
    try {
        var stats = {
            'today':{
                'new':0,
                'old':0
            },
            'today-1':{
                'new':0,
                'old':0
            },
            'today-2':{
                'new':0,
                'old':0
            },
            'today-3':{
                'new':0,
                'old':0
            },
            'today-4':{
                'new':0,
                'old':0
            },
            'today-5':{
                'new':0,
                'old':0
            },
            'today-6':{
                'new':0,
                'old':0
            },
        }

        Stat
            .find({})
            .then((allStats) => {
                for (let i = 0; i < allStats.length; i++) {
                    const stat = allStats[i]
                    const daysDiff = moment().diff(moment(stat.date_creation).format("YYYY-MM-DD"),'days');
                    switch (daysDiff) {
                        case 6:{
                            stats['today-6'].new+=1;
                            break;
                        }
                        case 5:{
                            stats['today-5'].new+=1;
                            break;
                        }
                        case 4:{
                            stats['today-4'].new+=1;
                            break;
                        }
                        case 3:{
                            stats['today-3'].new+=1;
                            break;
                        }
                        case 2:{
                            stats['today-2'].new+=1;
                            break;
                        }
                        case 1:{
                            stats['today-1'].new+=1;
                            break;
                        }
                        case 0:{
                            stats['today'].new+=1;
                            break;
                        }
                        default:{
                            stats['today-6'].old+=1;
                        }
                    }
                }
                stats['today-5'].old = stats['today-6'].new + stats['today-6'].old;
                stats['today-4'].old = stats['today-5'].new + stats['today-5'].old;
                stats['today-3'].old = stats['today-4'].new + stats['today-4'].old;
                stats['today-2'].old = stats['today-3'].new + stats['today-3'].old;
                stats['today-1'].old = stats['today-2'].new + stats['today-2'].old;
                stats['today'].old = stats['today-1'].new + stats['today-1'].old;
                console.log(stats)
                return res.status(200).json(stats)
            }).catch((err) => {
                return res.status(400).json({msg: 'Something Went Wrong'})
            });
    } catch (error) {
        return res.status(400).json({msg: 'Something Went Wrong'})
    }
}