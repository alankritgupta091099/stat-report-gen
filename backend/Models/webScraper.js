const puppeteer = require('puppeteer');

const Stat = require('../DB/stat.modal.js');
const data =  require('./URL_list.json');

module.exports = {
    webScraper: webScraper,
    scrapStatShow: scrapStatShow
}

// @route POST /scrap/heading
// @desc Scrap the heading of news headline
// @access --------Pending

async function webScraper(req,res, Test_btn = true) {

    // if (Test_btn = true) 
    //  send_response(use it for debugging purpose - to check working of function ) 
    // if (Test_btn = false) 
    //  return_values(use it to return values for report generation API)
    
    let articleURL = (res) ? req.body.link : req;
    let articleTitle = "Some Heading";
    let base64 = "img";
    let screenShotOptions = {
        encoding: "base64", 
        fullPage:false,
        type:"jpeg",
        quality:40
    };    
    let start = Date.now();
    console.log("Scraping headline!!")
    try {
        let browser = await puppeteer.launch({
            headless: true,
            args: [
            "--no-sandbox",
            "--disable-gpu",
            '--disable-dev-shm-usage'
            ]
        })
        let page = await browser.newPage();
        
        await page.setViewport({
            width: 1080,
            height: 720,
        });
        await page.goto(articleURL,{waitUntil:'load',timeout:45000});
        articleTitle = await page.title(); //Date scrap - pending!
        base64 = await page.screenshot(screenShotOptions);
        await browser.close();
        
        console.log('==>Took', Date.now() - start, 'ms to fetch title & take screenshot- ',articleTitle);

        if(Test_btn){
            res.status(200).json({
                "articleURL":articleURL,
                "articleHeadline":articleTitle,
                "screenShot":base64
            })
        } else {        
            return {
                "articleURL":articleURL,
                "articleHeadline":articleTitle,
                "screenShot":base64
            }
        }
    } catch (error) {
        console.log(error)
        console.log("Could not fetch headline")
        if(Test_btn){
            res.status(400).json({msg:"Something went wrong"})
        }
        else{ 
            console.log(error)   
            return {
                "articleURL":"N/A",
                "articleHeadline":"N/A",
                "screenShot":"N/A"
            }
        }
    }
    
} 

// @route POST /scrap/stats
// @desc Scrap the the data from statshow
// @access --------Pending

async function scrapStatShow(req,res,Test_btn = true, stats = {}) {

    let list, statsToReturn={};
    var siteARR = (res) ? [req.body.site_name] : [req]
    var reqTypeSingle = true; //acts as trigger for single request or a list of URL's

    //check of the input is a single request or multiple
    if(data.status){   
        reqTypeSingle = false;
        siteARR = data.list;
        console.log("Scraping list of URL's via local file from statshow..")
    }
    //console.log(siteARR) 
    let multiple=1;
    if(stats.type=='Monthly') multiple=30
    else if(stats.type=='Yearly') multiple=365

    console.log(stats)
    for (let i=0;i< siteARR.length;i++) {
        //console.log("//================== Working on Stat #",i+1," ===================//")
        var domain = await extractURL(siteARR[i])
        await Stat.findOne({"site_name": domain})
            .then(async stat => { 
                if(stat){//========================================Date ka time ka check lagana bacha hai
                    if(reqTypeSingle) {
                        if (Test_btn) 
                            return res.status(200).json(stat) 
                        else {
                            statsToReturn.site_name=stat.site_name;
                            if(stats['variety']==='Page-Viewers')
                                statsToReturn.info=stat.dailyPageViews*multiple
                            else
                                statsToReturn.info=stat.dailyVisitors*multiple
                        }; 
                    }
                    console.log("Stat found in DB: ", statsToReturn);
                } else {
                    await console.log("Scrapping Statshow for: ",siteARR[i])
                    let statShowURL = await 'https://www.statshow.com/'+siteARR[i]; 
                    let start = Date.now();
                    let browser = await puppeteer.launch({
                        headless: true,
                        args: [
                        "--no-sandbox",
                        "--disable-gpu",
                        '--disable-dev-shm-usage'
                        ]
                    })
                    let page = await browser.newPage();
                    await page.goto(statShowURL);
                    await page.waitFor('.worth_left_box');

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
                    //console.log("Scrapped data: ", statData)
                    await console.log('==> Took', Date.now() - start, 'ms to scrap data from statshow');
                    await statData
                        .save()
                        .then(()=>{console.log("Stat saved: ", statData)}) 
                        .catch((err)=>{console.log(err)})
                    if(reqTypeSingle){
                        Test_btn ? res.status(200).json(statData) : statsToReturn=stat;                        
                    }
                }
            })
            .catch(err=>{
                console.log(err)
                return res.status(404).json({msg:'Something went wrong !'})
            })
    };
    reqTypeSingle ? console.log("Execution of single query completed !!"):console.log("Execution on List of URL's completed !!")
    return statsToReturn
}

function extractURL(url){//===========================================www aur non www wale ka issue pending hai due to which redundant data can be stored in db
    var urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
    var domain = urlParts[0];
    //console.log('Converted Domain from the link: ',domain);
    return domain
}
