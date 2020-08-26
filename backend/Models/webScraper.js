const puppeteer = require('puppeteer');

module.exports = {
    webScraper: webScraper,
    scrapStatShow: scrapStatShow
}

// to scrap the heading of news headline
async function webScraper(req,res) {
    let articleURL = 'http://www.uniindia.com/modicare-limited-recognized-as-india-s-5th-best-mid-size-company-to-work-for-by-great-place-to-work/business-wire-india/news/2069391.html';
    let screenShotOptions = {
        path:'img.png',
        fullPage:false,
        omitBackground:false
    };
    
    let start = Date.now();
    let browser = await puppeteer.launch()
    let page = await browser.newPage();
    await page.setViewport({
        width: 1080,
        height: 720,
    });

    await page.goto(articleURL);
    let articleTitle = await page.title();
    await page.screenshot(screenShotOptions);
    await browser.close();
    console.log('Took', Date.now() - start, 'ms to fecth title- ',articleTitle,' & take screenshot');
    //console.log(articleTitle)
    res.send(articleTitle)
} 

//to scrap the the data from statshow
async function scrapStatShow(req,res) {
    let statShowURL = 'https://www.statshow.com/'+'http://www.businessworld.in/article/Modicare-Limited-recognized-as-India-s-5th-Best-Mid-size-Company-to-Work-for-by-Great-Place-to-Work-174-/07-07-2020-295012/' 

    let start = Date.now();
    let browser = await puppeteer.launch()
    let page = await browser.newPage();
    await page.goto(statShowURL,{waitUntil:'networkidle2'});

    let list = await page.evaluate(()=>{
        let data = [];
        let nodeList = document.querySelectorAll('div[id="box_1"] > span[class="red_bold"]');
        let nodeArray = Array.from(nodeList);
        nodeArray.forEach((node)=>{data.push(node.innerHTML)})
        return data
    })

    await page.close();
    await browser.close();
    console.log('Took', Date.now() - start, 'ms to scrap data from statshow');
    res.send({
        'dailyPageViews':list[0],
        'dailyVisitors':list[1]
    })
}
