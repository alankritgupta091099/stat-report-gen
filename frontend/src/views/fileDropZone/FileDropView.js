import React,{ useState } from 'react';
import { Box, Container, Card, CardContent, Typography , Grid , List , ListItem , ListItemText , Button , Snackbar , Dialog , Slide , AppBar , IconButton , Toolbar , Backdrop , CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import axios from 'axios';
import { OutTable , ExcelRenderer } from 'react-excel-renderer';
import { saveAs } from "file-saver";
import { Document, HorizontalPositionAlign, HorizontalPositionRelativeFrom, Media, Packer, Paragraph, Header, VerticalPositionAlign, VerticalPositionRelativeFrom, Table, TableRow, WidthType, TableCell, VerticalAlign, HyperlinkRef, HyperlinkType } from "docx";
import { makeStyles } from '@material-ui/core/styles';

import store from "src/store.js";
import { API_URL } from 'src/helpers/utils.js';
import Page from 'src/components/Page';
import FormatForm from './FormatForm.js'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

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
  const classes = useStyles();
  const {acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({accept:"text/csv , application/vnd.oasis.opendocument.spreadsheet , application/vnd.ms-excel , application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  const [notification, setnotification] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [backdrop, setbackdrop] = useState(false)
  const [table, setTable] = useState(false)
  const [dialog, setDialog] = useState(false);
  const [dialogCloseBtn, setDialogCloseBtn] = useState(true);
  const [finalList, setFinalList] = useState([]);
  const [imgHeader, setimgHeader] = useState({name:"*Nothing Selected*"})

  const handleClose = () => {
    setDialog(false);
  };

  function getBase64(file, cb) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
          cb(reader.result)
      };
      reader.onerror = function (error) {
          console.log('Error: ', error);
      };
  }

  const genButton = async (format) => {
    var IMAGE_BUFFER = "";

    if(format.header){
      if(imgHeader.size){
        setDialog(false)
        setbackdrop(true)
        await getBase64(imgHeader, (result) => {
          IMAGE_BUFFER = result.split(",")[1]
          console.log(IMAGE_BUFFER)
          axios({
            method:'post',
            url:`${API_URL}/report/gen`,
            headers:{
              'x-auth-token': store.getState().auth.token
            },
            data:{
              list:finalList,
              format,
              headerImg:IMAGE_BUFFER
            }
          })
          .then(res=>{        
            setnotification(res.data.msg)        
            setNotificationOpen(true);
            setbackdrop(false);
            window.location.reload();
          })
          .catch(err=>console.log(err))
        });
      } else alert("Upload header image first!")
    } else{ 
      setDialog(false)
      setbackdrop(true)
      axios({
        method:'post',
        url:`${API_URL}/report/gen`,
        headers:{
          'x-auth-token': store.getState().auth.token
        },
        data:{
          list:finalList,
          format,
          headerImg:IMAGE_BUFFER
        }
      })
      .then(res=>{        
        setnotification(res.data.msg)        
        setNotificationOpen(true);
        setbackdrop(false);
        window.location.reload();
      })
      .catch(err=>console.log(err))
    }
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
    <Page title="Generate Report" >
      <Backdrop className={classes.backdrop} open={backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container>
        <Box mt={3}>
        <Snackbar open={notificationOpen} autoHideDuration={4000} onClose={()=>setNotificationOpen(false)}>
          <Alert onClose={()=>setNotificationOpen(false)} elevation={6} variant="filled" severity="success">
            {notification}
          </Alert>
        </Snackbar>
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
                              <Button variant="contained" color="primary" disableElevation onClick={()=>setDialog(true)}>
                                Select Formating Option
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
        <FormatForm genButton={genButton} imgHeader={imgHeader} setimgHeader={setimgHeader}/>
      </Dialog>
    </Page>
  );
}

export default FileDropView;
