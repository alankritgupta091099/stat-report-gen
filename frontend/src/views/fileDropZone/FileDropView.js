import React,{ useState , useRef } from 'react';
import { Box, Container, Card, CardContent, Typography , Grid , List , ListItem , ListItemText , Button , Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useNavigate } from 'react-router-dom';
import { ExcelRenderer } from 'react-excel-renderer';
import { makeStyles } from '@material-ui/core/styles';

import { SET_LIST } from "src/actions/types.js";
import store from "src/store.js";
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  input: {
    display: 'none',
  },
  box: {
    border: "1px "+theme.palette.primary.main+ " solid",
    borderRadius: "5px"
  }
}));

function FileDropView(props) {
  const classes = useStyles();
  const [notification, setnotification] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [table, setTable] = useState(false)
  const [finalList, setFinalList] = useState([]);
  const navigate = useNavigate();
  const [sev, setsev] = useState("success");
  const [files, setfiles] = useState({
    name:"",
    size:""
  })

  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);
  
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  const handleChange = event => {
      var firstElement=event.target.files[0];
      if(firstElement.type==="text/csv" || firstElement.type==="application/vnd.oasis.opendocument.spreadsheet" || firstElement.type==="application/vnd.ms-excel" || firstElement.type==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
        setfiles({
          name:firstElement.name,
          size:firstElement.size
        })
        ExcelRenderer(firstElement, (err, resp) => {
          if(err){
            setsev("error")
            setnotification("Something went wrong")
            setNotificationOpen(true)
            console.log(err);            
          }
          else{
            const {rows , cols} = resp;            
              if( cols.length === 1 ){
                setTable(true)
                var linksKiList = [];
                rows.slice(1).forEach(item => {
                  linksKiList.push(item[0])
                });
                if(store.getState().auth.user.plan.limitLeft>linksKiList.length && store.getState().auth.user.accountType!=="Expired"){
                  setFinalList(linksKiList)
                  store.dispatch({  
                      type:SET_LIST,
                      payload:linksKiList
                  })
                  setsev("success")
                  setnotification("Number of links in the list: "+linksKiList.length)
                  setNotificationOpen(true)
                } else {
                  setsev("error")
                  if(store.getState().auth.user.accountType==="Expired") 
                    setnotification("Your account has expired!!")
                  else 
                    setnotification("INSUFFICIENT CREDIT LIMIT!!")
                  setNotificationOpen(true)
                  setTable(false)
                }
              } else {
                setsev("error")
                setnotification("More that one number of column received")
                setNotificationOpen(true)
                setTable(false)
              }            
          }
        })      
    } else {
      setsev("error")
      setnotification("Unacceptable file format")
      setNotificationOpen(true)
    } 
  };

  return (
    <Page title="Generate Report" >
      <Container>
        <Box mt={3}>
        <Snackbar open={notificationOpen} autoHideDuration={3000} onClose={()=>setNotificationOpen(false)}>
          <Alert onClose={()=>setNotificationOpen(false)} elevation={6} variant="filled" severity={sev}>
            {notification}
          </Alert>
        </Snackbar>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h1">Generate Report</Typography>
              <input
                accept="text/csv , application/vnd.oasis.opendocument.spreadsheet , application/vnd.ms-excel , application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className={classes.input}
                ref={hiddenFileInput}
                onChange={handleChange}
                type="file"
              />
              <label htmlFor="contained-button-file">
                <Typography variant="h6">
                  Select File: 
                  &nbsp;&nbsp;&nbsp;
                  <Button variant="outlined" color="primary" component="span" onClick={handleClick}>
                    UPLOAD
                  </Button>
                </Typography>
              </label>
              <br/>
              <br/>
              <Grid container>
                <Grid item xs={6}>
                  {
                    table ? <>
                              <Typography variant="h2">Selected File: 
                                <Typography variant="subtitle1" color="textSecondary">{files.name} - {files.size} bytes</Typography>
                              </Typography>
                              <br/>
                              <Button variant="contained" color="primary" disableElevation onClick={()=>navigate('/app/report-gen/format')}>
                                Formating Option
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
                          primary='1. Click on "Upload" to upload the file'
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText>
                          2. Make sure that the file has single column only and value of First Row as "Links" <i><a href="./sample.xlsx" download>Sample File</a></i>
                        </ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary='3. Click on "Formatting Option" button'
                        />
                      </ListItem>
                      <ListItem className={classes.box}>
                        <ListItemText><i>Note: Make sure that file is of <b>xlsx / xls / csv / ods</b> format only.</i></ListItemText>
                      </ListItem>
                    </List>
                  </Typography>
                </Grid>
              </Grid>                            
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
}

export default FileDropView;
