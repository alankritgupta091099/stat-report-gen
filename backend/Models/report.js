var { webScraper , scrapStatShow } =  require('./webScraper.js');

module.exports={
    generateReport:generateReport
}

// @route POST /report/gen
// @desc Generate report 
// @access --------Pending

async function generateReport(req,res) {

    var list = req.body.list; 

    console.log("List of links ",list);

    var articleDetails, siteDetails, responseData = [];

    console.log("Fetching data for report...")

    try {
        for (let i = 0; i < list.length; i++) {
            console.log("Report item #",i+1)
            articleDetails = await webScraper(list[i],null,false);
            siteDetails = await scrapStatShow(list[i],null,false);
            responseData.push({
                articleDetails , 
                siteDetails
            })
        }
    } catch (error) {
        res.status(400).json({msg:"Something went Wrong"})
        console.log(error)       
    }

    console.log("All data fetched !!!")
    res.status(200).json(responseData)
}