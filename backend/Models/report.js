var { webScraper , scrapStatShow } =  require('./webScraper.js');

module.exports={
    generateReport:generateReport
}

async function generateReport(req,res) {
    try { 
        console.log(req.body.list);
        var list = req.body.list; 
        var articleDetails, siteDetails;
        var responseData = []
        console.log("Fetching data for report...")
        for (let i = 0; i < list.length; i++) {
            console.log("Report item #",i+1)
            articleDetails = await webScraper(list[i],null,false);
            siteDetails = await scrapStatShow(list[i],null,false);
            responseData.push({
                articleDetails , 
                siteDetails
            })
        }
        //console.log(siteDetails)
        console.log("All data fetched !!!")
        res.status(200).json(responseData)
    } catch (error) {
        console.log(error)       
    }
}