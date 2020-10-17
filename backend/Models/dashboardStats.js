const moment = require('moment');
const User = require('../DB/user.modal.js');
const Stat = require('../DB/stat.modal.js');

module.exports = {
    totalDocs,
    calculateRevenue,
    totalCustomers,
    StatHistory7Days,
    coveragesScanned
}

function totalDocs(req,res) {
    try {
        User
            .find({accountType:{$ne:'Admin'}})
            .then((userList)=>{
                var totalDocs = 0;
                for (let i = 0; i < userList.length; i++) {
                    const user = userList[i];
                    for (let j = 0; j < user.coveragesScanned.length; j++) {
                        const element = user.coveragesScanned[j];
                        if(moment(element.time).month()===moment().month())
                            totalDocs+=1
                    }
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

function coveragesScanned(req,res){
    try {
        var total = 0;
        User
            .find({accountType:{$ne:'Admin'}})
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    const user = result[i];
                    for (let j = 0; j < user.coveragesScanned.length; j++) {
                        const element = user.coveragesScanned[j];
                        if(moment(element.time).month()===moment().month())
                            total+=element.count
                    }
                }
                return res.status(200).json(total)
            }).catch((err) => {
                return res.status(400).json({msg: 'Something Went Wrong'})        
            });
    } catch (error) {
        return res.status(400).json({msg: 'Something Went Wrong'})
    }
}

function calculateRevenue(req,res) {
    try {
        var today = moment().format();      
        var startOfMonth = moment().startOf('month').format();
        var endOfMonth = moment().endOf('month').format();
        var totalCost=0;
        console.log(startOfMonth)
        User
            .find({
                "accountType":"Paid",
                "plan.validFrom":{$gte:startOfMonth,$lte:endOfMonth}
            })
            .then((userList) => {        
                console.log(userList)
                for (let i = 0; i < userList.length; i++) {
                    totalCost+=userList[i].plan.cost
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
        var usedInLast7Days = 0;
        Stat
            .find({})
            .then((allStats) => {
                for (let i = 0; i < allStats.length; i++) {

                    const stat = allStats[i]
                    for (let j = 0; j < stat.lastVisited.length; j++) {
                        const element = stat.lastVisited[j];
                        if(!moment(element.visitor_time).isBefore(moment().subtract(7,'days'))){
                            usedInLast7Days+=1;
                            break;
                        }
                    }

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
                var perc = usedInLast7Days/(stats['today'].old + stats['today'].new);
                return res.status(200).json({stats, perc})
            }).catch((err) => {
                return res.status(400).json({msg: 'Something Went Wrong'})
            });
    } catch (error) {
        return res.status(400).json({msg: 'Something Went Wrong'})
    }
}