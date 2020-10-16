const { webScraper , scrapStatShow } = require('./webScraper.js');
const { fetchFollowerCount } = require('./instaFetch.js');
const { generateReport } = require('./report.js');
const { createUser , loginUser , getUserFromToken } = require('./user.js');
const { fetchCustomers , editCustomer } = require('./customer.js');
const { totalDocs , calculateRevenue , totalCustomers , StatHistory7Days , coveragesScanned } = require('./dashboardStats.js');

module.exports = {

    //scraper
    webScraper: webScraper,
    scrapStatShow: scrapStatShow,

    //insta
    fetchFollowerCount:fetchFollowerCount,

    //report
    generateReport:generateReport,
    
    //user
    createUser: createUser,
    loginUser: loginUser,
    getUserFromToken,

    //customer
    fetchCustomers: fetchCustomers,
    editCustomer:editCustomer,

    //dashboard stats
    totalDocs,
    calculateRevenue,
    totalCustomers,
    StatHistory7Days,
    coveragesScanned
}