var { webScraper , scrapStatShow } =  require('./webScraper.js');

module.exports={
    generateReport:generateReport
}
// This function is working completely fine - tried and tested backend only - for 30+ linkes from postman
//Some issue in frontend while calling this API -  due to which function is getting called multiple times therefore report is restarting again & again.
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