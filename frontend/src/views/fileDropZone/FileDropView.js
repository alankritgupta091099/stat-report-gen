import React,{ useState } from 'react';
import { Box, Container, Card, CardContent, Typography , Grid , List , ListItem , ListItemText , Button , Snackbar , Dialog , Slide , LinearProgress , AppBar , IconButton , Toolbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import axios from 'axios';
import { OutTable , ExcelRenderer } from 'react-excel-renderer';
import { saveAs } from "file-saver";
import { Document, HorizontalPositionAlign, HorizontalPositionRelativeFrom, Media, Packer, Paragraph, Header, VerticalPositionAlign, VerticalPositionRelativeFrom, Table, TableRow, WidthType, TableCell,VerticalAlign, TextDirection, HeadingLevel, HyperlinkRef, HyperlinkType } from "docx";

import Page from 'src/components/Page';

const getColor = (props) => {
  if (props.isDragAccept) {
      return '#00e676';
  }
  if (props.isDragReject) {
      return '#ff1744';
  }
  if (props.isDragActive) {
      return '#2196f3';
  }
  return '#eeeeee';
}

const DropBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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
                children: [new Paragraph({ text: "Daily Page Viewers" })],
                verticalAlign: VerticalAlign.CENTER
            }),
        ],
        tableHeader: true,                
    }
)];

var secondaryPage = [];

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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

function FileDropView(props) {
  const {acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone();
  
  const [table, setTable] = useState(false)
  const [dialog, setDialog] = useState(false);
  const [dialogCloseBtn, setDialogCloseBtn] = useState(false);
  const [loader, setLoader] = useState(false);
  const [finalList, setFinalList] = useState([]);

  const docxFile = async (data) => {
    
    const doc = new Document({
        creator: "media-measurements.com",
        description: "a Detailed Client Report",
        title: "Client Report",
    });

    //logo header pending
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
                        children: [new Paragraph({text: item.articleDetails.articleHeadline})],
                        verticalAlign: VerticalAlign.CENTER,
                        margins: {
                          top: 15,
                          bottom: 15,
                          left: 15,
                          right: 15,
                        }
                    }),
                    new TableCell({
                        children:[new Paragraph({text:""+item.siteDetails.dailyPageViews})],//add commas
                        verticalAlign: VerticalAlign.CENTER
                    })
                ]               
            })
        )

        secondaryPage.push(
            {
                "secondaryTableData_Publication": new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({text:"Publication: "})],
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
                            children: [new Paragraph({text:"Headline: "})],//hyperlinking pending
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children:[new Paragraph({text:item.articleDetails.articleHeadline})],
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
                            children: [new Paragraph({text:"Daily Page Viewers: "})],//hyperlinking pending
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children:[new Paragraph({text:""+item.siteDetails.dailyPageViews})],
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

    doc.addSection({
      children: [mainTable]
    });

    for (let i = 0; i < data.length; i++) {
        doc.addSection({
            children: [returnTableFromRows(secondaryPage[i]), new Paragraph({}), new Paragraph({}), secondaryPage[i].screenShot]
        });    
    }
    console.log(doc)
    let start = Date.now();

    Packer.toBlob(doc).then(blob => {//R&D pending!! -  find a way to speed it up
      console.log(blob);
      saveAs(blob, "report.docx");
      console.log("Document created successfully in ",Date.now() - start);
      setLoader(false);
      setDialogCloseBtn(true);
      setTable(false);
    });
  }

  const handleClose = () => {
    setDialog(false);
  };

  const genButton = () => {
    setDialog(true);
    setLoader(true);
    var reqArr = []
    for (let i = 0; i < Math.ceil(finalList.length/4) ; i++) {
      reqArr.push(axios({
        method:'post',
        url:'http://localhost:8080/report/gen',
        data:{
          list:finalList.slice(4*i,4*i+4)
        }
      }))
    }
    axios
      .all(reqArr)
      .then(res=>{
        console.log("Date received from backend")
        var docArr=[];
        console.log(res)
        res.forEach(item => {
          docArr.push(...item.data)
        });
        docxFile(docArr)
      })
      .catch(err=>console.log(err))
  }

  const files = acceptedFiles.map(file => {  
    ExcelRenderer(file, (err, resp) => {
      if(err){
        console.log(err);            
      }
      else{
        const {rows , cols} = resp;     
        if( cols.length == 1 ){
          setTable(true)
          var linksKiList = [];
          rows.slice(1).forEach(item => {
            linksKiList.push(item[0])
          });
          setFinalList(linksKiList)
        } else {
          //error handling
        }
      }
    });     
    return (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    )}
  );

  return (
    <Page>
      <Container>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h1">Generate your report</Typography>
              <div className="container">
                <DropBox {...getRootProps({ className: 'dropzone', isDragActive, isDragAccept, isDragReject })}>{/* Later add Hover styling and others as well */}
                  <input {...getInputProps()} />
                  <h3>Drag 'n' drop some files here, or click on this section to upload files</h3><br/>
                  <h4>Accepted formats xlsx, xls, csv, odf</h4>
                </DropBox>
              </div>
              <br/>
              <br/>
              <Grid container>
                <Grid item xs={6}>
                  {
                    table ? <>
                              <Typography variant="h2">Selected File: 
                                <Typography variant="subtitle1" color="textSecondary">{files}</Typography>
                              </Typography>
                              <br/>
                              <Button variant="contained" color="primary" disableElevation onClick={genButton}>
                                Generate Report
                              </Button>
                            </>
                          : "" 
                  }
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h2">
                    Instructions
                  </Typography >
                  <Typography variant="h5">
                    <List>
                      <ListItem>
                        <ListItemText
                          primary='1. Drag n drop the file in the section or click on the section to upload the file'
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary='2. Make sure that the file has single column only and value of Row 1 "Links"'
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary='3. Click on "Generate" button'
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary='Note: Make sure that file is only of formats xlsx, xls, csv, odf'/>
                      </ListItem>
                    </List>
                  </Typography>
                </Grid>
              </Grid>                            
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Dialog fullScreen open={dialog} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar>
          <Toolbar>
          {
            dialogCloseBtn ? <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton> : ""
          }            
          </Toolbar>
        </AppBar>
        <br/><br/>
        <br/><br/>
        <h1>Please wait while we are generating your report..</h1>
        {
          loader ? <LinearProgress /> : ""
        }       
      </Dialog>
    </Page>
  );
}

export default FileDropView;
