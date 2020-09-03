const puppeteer = require('puppeteer');

const Stat = require('../DB/stat.modal.js');
const data =  require('./URL_list.json');

module.exports = {
    webScraper: webScraper,
    scrapStatShow: scrapStatShow
}

// to scrap the heading of news headline
async function webScraper(req,res, Test_btn = true) {

    // if (Test_btn = true) 
    //  send_response(use it for debugging purpose - to check functionality of the function ) 
    // if (Test_btn = false) 
    //  return_values(use it to return values for report generation API)

    let articleURL = (res) ? req.body.link : req;
    let screenShotOptions = {
        encoding: "base64", 
        fullPage:false,
        omitBackground:false
    };
    
    let start = Date.now();
    console.log("Scraping started ")
    let browser = await puppeteer.launch()
    let page = await browser.newPage();
    await page.setViewport({
        width: 1080,
        height: 720,
    });

    await page.goto(articleURL);
    let articleTitle = await page.title();
    const base64 = await page.screenshot(screenShotOptions);
    await browser.close();
    console.log('Took', Date.now() - start, 'ms to fetch title- ',articleTitle,' & took screenshot');

    if(Test_btn){
        res.status(200).json({
            "article-url":articleURL,
            "article-headline":articleTitle,
            "screen-shot":base64
        })
    } else {        
        return {
            "article-url":articleURL,
            "article-headline":articleTitle,
            "screen-shot":base64
        }
    }
    
} 

//to scrap the the data from statshow
async function scrapStatShow(req,res) { 

    let list;
    var siteARR = [req.body.site_name]
    var reqTypeSingle = true; //acts as trigger for single request or a list of URL's

    //check of the input is a single request or multiple
    if(data.status){   
        reqTypeSingle = false;
        siteARR = data.list;
        console.log("Working on list of URL's..")
    }

    console.log(siteARR) 
    for (let i=0;i< siteARR.length;i++) {
        console.log("//================== Working on Stat #",i+1," ===================//")
        var domain = await extractURL(siteARR[i])
        await Stat.findOne({"site_name": domain}) 
            .then(async stat => { 
                if(stat){//========================================Date ka time ka check lagana bacha hai
                    if(reqTypeSingle) res.status(200).json(stat); 
                    console.log("Stat found in DB: ", stat);
                } else {
                    console.log("Scrapping Statshow..")
                    let statShowURL = 'https://www.statshow.com/'+siteARR[i]; 
                    let start = Date.now();
                    let browser = await puppeteer.launch()
                    let page = await browser.newPage();
                    await page.goto(statShowURL,{waitUntil:'networkidle2'});
                    
                    //returns list of stats for a particular site
                    list = await page.evaluate(()=>{
                        let data = [];
                        let nodeList = document.querySelectorAll('div[id="box_1"] > span[class="red_bold"]');
                        let nodeArray = Array.from(nodeList);
                        nodeArray.forEach((node)=>{data.push(node.innerHTML)})
                        return data
                    })

                    await page.close();
                    await browser.close();
                    
                    const statData = new Stat({
                        site_name: domain,
                        dailyPageViews: parseInt(list[0].replace(/,/g,"")),
                        dailyVisitors: parseInt(list[1].replace(/,/g,""))   
                    })
                    console.log("Scrapped data: ", statData)
                    console.log('Took', Date.now() - start, 'ms to scrap data from statshow');
                    await statData
                        .save()
                        .then(()=>{console.log("Stat saved: ", statData)}) 
                        .catch((err)=>{console.log(err)})
                    if(reqTypeSingle){
                        res.status(200).json(statData)
                    }
                }
            })
            .catch(err=>{
                console.log(err)
                return res.status(404).json({msg:'Something went wrong !'})
            })
    };
    await reqTypeSingle ? console.log("Execution of single query completed !!"):console.log("Execution on List of URL's completed !!")
}

function extractURL(url){//===========================================www aur non www wale ka issue pending hai due to which redundant data can be stored in db
    var urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
    var domain = urlParts[0];
    console.log('Converted Domain from the link: ',domain);
    return domain
}
