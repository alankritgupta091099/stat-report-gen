var { webScraper } =  require('./webScraper.js');

module.exports={
    generateReport:generateReport
}

async function generateReport(req,res) {
    try {
        var list = req.body.list;
        var  articleDetails = [];
        console.log("Fetching data for report...")
        for (let i = 0; i < list.length; i++) {
            console.log("Reprt item #",i+1)
            articleDetails.push(await webScraper(list[i],null,false));
        }
        console.log("All data fetched !!!")
        res.status(200).json(articleDetails)
    } catch (error) {
        console.log(error)       
    }
}