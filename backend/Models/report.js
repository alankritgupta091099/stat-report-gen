const jwt = require('jsonwebtoken');
var fs = require("fs");

var nodemailer = require('nodemailer');
var { Document, HorizontalPositionAlign, HorizontalPositionRelativeFrom, Media, Packer, Paragraph, Header, VerticalPositionAlign, VerticalPositionRelativeFrom, Table, TableRow, WidthType, TableCell, VerticalAlign, HyperlinkRef, HyperlinkType } = require("docx");

var { webScraper , scrapStatShow } =  require('./webScraper.js');

module.exports={
    generateReport:generateReport
}

// @route POST /report/gen
// @desc Generate report 
// @access PRIVATE

async function generateReport(req,res) {

    var list = req.body.list; 
    var format = req.body.format;
    var headerImg = req.body.headerImg;

    res.status(200).json({msg:"You will receive the file on your registered Email Id"})
    var articleDetails, siteDetails, responseData = [];

    console.log("Fetching data for report...")

    const decoded = jwt.verify( req.header('x-auth-token') , process.env.SECRET_KEY )

    try {
        for (let i = 0; i < list.length; i++) {
            console.log("Report item #",i+1)
            console.log(format.primaryTable)
            articleDetails = await webScraper(list[i],null,false,format.secondaryTable);
            siteDetails = await scrapStatShow(list[i],null,false,format.primaryTable.stats,decoded);
            console.log(siteDetails)
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
    docxFile(responseData,format,headerImg)
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const docxFile = async (data,format,headerImg) => {
    var links = {};    
    var secondaryPage = [];    
    var IMAGE_BUFFER = headerImg;

    var varietyStr = format.primaryTable.stats.variety==='Page-Viewers' ? "Page Viewers" : "Page Visitors";
    var typeStr = "Daily "
    
    if (format.primaryTable.stats.type==='Monthly') typeStr="Monthly "
    else if(format.primaryTable.stats.type==='Yearly') typeStr="Yearly "

    var returnTableFromRows = (rows) => {
        return new Table({
            cantSplit: true,
            columnWidths: [20,80],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            rows: [rows.secondaryTableData_Publication, rows.secondaryTableData_Headline, rows.secondaryTableData_DailyPageViews] 
        }) 
    }

    for (let i = 0; i < data.length; i++) {
      var item = data[i];
      links["link_"+i]={
          link: item.articleDetails.articleURL,
          text: item.articleDetails.articleHeadline,
          type: HyperlinkType.EXTERNAL,
        }      
    }

    const doc = new Document({
        creator: "get-measurements.com",
        description: "Detailed Client Report",
        title: "Client Report",
        hyperlinks: links
    });

    var mainTableRows = [
        new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph({text:"S. No."})],
                    verticalAlign: VerticalAlign.CENTER
                }),
                new TableCell({
                    children: [new Paragraph({text: "Publication"})],
                    verticalAlign: VerticalAlign.CENTER
                }),
                new TableCell({
                    children: [new Paragraph({ text: "Headline" })],
                    verticalAlign: VerticalAlign.CENTER
                }),
                new TableCell({
                    children: [new Paragraph({ text: typeStr+varietyStr })],
                    verticalAlign: VerticalAlign.CENTER
                }),
            ],
            tableHeader: true,                
        }
    )];

    for (let i = 0; i < data.length; i++) {
        var item = data[i];
        var publication_name;        

        if(item.siteDetails.site_name.split('.').length=='3')
          publication_name=capitalize(item.siteDetails.site_name.split('.')[1])
        else 
          publication_name=capitalize(item.siteDetails.site_name.split('.')[0])

        mainTableRows.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({text: ""+(i+1)})],
                        verticalAlign: VerticalAlign.CENTER,
                        margins: {
                          left: 10,
                        }
                    }),
                    new TableCell({
                        children: [new Paragraph({text:publication_name})],//capitalise first letter pending
                        verticalAlign: VerticalAlign.CENTER,
                        margins: {
                          left: 10,
                        }
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [new HyperlinkRef("link_"+i)],
                        })],
                        verticalAlign: VerticalAlign.CENTER,
                        margins: {
                          top: 15,
                          bottom: 15,
                          left: 15,
                          right: 15,
                        }
                    }),
                    new TableCell({
                        children:[new Paragraph({text:""+item.siteDetails.info})],//add commas
                        verticalAlign: VerticalAlign.CENTER
                    })
                ]               
            })
        )
        if(format.secondaryTable)
          secondaryPage.push(
            {
                "secondaryTableData_Publication": new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({text:"Publication "})],
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children:[new Paragraph({text:publication_name})],
                            verticalAlign: VerticalAlign.CENTER
                        })
                    ]               
                }),             
                "secondaryTableData_Headline": new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({text:"Headline "})],
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children:[new Paragraph({
                                children: [new HyperlinkRef("link_"+i)],
                            })],
                            verticalAlign: VerticalAlign.CENTER,
                            margins: {
                              top: 15,
                              bottom: 15,
                              left: 15,
                              right: 15,
                            }
                        })
                    ]               
                }),
                "secondaryTableData_DailyPageViews": new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({text: typeStr+varietyStr})],
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children:[new Paragraph({text:""+item.siteDetails.info})],
                            verticalAlign: VerticalAlign.CENTER
                        })
                    ]               
                }),
                "screenShot":new Paragraph({
                     children:[Media.addImage(doc, Buffer.from(item.articleDetails.screenShot, "base64"), 600, 400)]
                })
            }
        ) 

    }

    const mainTable = new Table({
        cantSplit: true,
        columnWidths: [10, 30, 40, 20],
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        rows: mainTableRows 
    });
    
    var image="";
    if(format.header){
        image = Media.addImage(doc, Buffer.from(IMAGE_BUFFER, "base64")
        ,100,90,
        {
            floating: {
                horizontalPosition: {
                    relative: HorizontalPositionRelativeFrom.PAGE,
                    align:HorizontalPositionAlign.CENTER
                },
                verticalPosition: {
                    relative: VerticalPositionRelativeFrom.PAGE,
                    offset: 1100
                },
            },
        }
        );
    }
    if(format.header){
        doc.addSection({
        headers: {
            default: new Header({
                children: [ new Paragraph(image)],
            })
        },
        children: [mainTable]
        });
    } else {
        doc.addSection({
        children: [mainTable]
        });
    }

    if(format.secondaryTable){ 
        for (let i = 0; i < data.length; i++) {
            if(format.header){
                doc.addSection({
                    headers: {
                        default: new Header({
                            children: [ new Paragraph(image)],
                        })
                    },
                    children: [returnTableFromRows(secondaryPage[i]), new Paragraph({}), new Paragraph({}), secondaryPage[i].screenShot]
                }); 
            } else {
                doc.addSection({
                    children: [returnTableFromRows(secondaryPage[i]), new Paragraph({}), new Paragraph({}), secondaryPage[i].screenShot]
                });
            }        
        }
    }
    
    console.log("Doc conversion started")
    let start = Date.now();
    Packer.toBuffer(doc).then(buff => {
        // fs.writeFileSync("My Document.docx", buff);
        // console.log("done")
        sendMail(buff)
    });
}

function sendMail(buff) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASS
        }
    });

    var mailOptions = {
        from: process.env.MAIL_ID,
        to: 'alankritgupta091099@gmail.com',
        subject: 'Client Report',
        text: 'This is an automatically generated email. Download the attached file and open in Ms Word, formatting will be perfectly fine.',
        attachments : [{
            filename : "Report.docx",
            content : buff,
        }]
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}