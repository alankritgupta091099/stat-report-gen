const { webScraper , scrapStatShow } = require('./webScraper.js');
const { fetchFollowerCount } = require('./instaFetch.js');

module.exports = {

    //scraper
    webScraper: webScraper,
    scrapStatShow: scrapStatShow,

    //insta
    fetchFollowerCount:fetchFollowerCount
    
}