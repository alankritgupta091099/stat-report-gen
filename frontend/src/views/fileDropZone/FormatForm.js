import React, { useState , useEffect , useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, Button, Card, CardContent, Container, Divider, Grid, makeStyles , Typography, Paper, Tabs, Tab , useTheme , Switch , Tooltip , IconButton , Radio, RadioGroup, FormControlLabel, FormControl, CardActions , Backdrop , CircularProgress , Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import SwipeableViews from 'react-swipeable-views';
import axios from 'axios';
import InfoIcon from '@material-ui/icons/Info';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useNavigate , Navigate } from 'react-router-dom';

import store from "src/store.js";
import { API_URL } from 'src/helpers/utils.js';
import Page from 'src/components/Page';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const infoMEssages = {
  statsType:"Select the type of Statistic you want to add in the report",
  userType:"Select the Statistic variety",
  secondaryButtonToggleInfo:"Enable secondary section",
  secondaryTableSameInfo:"This value depends upon primary section detailes",
  headerLogoOption:"Enable Custom Header Option"
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2)
  },
   backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormatForm = (props) => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [value_1, setValue_1] = useState(3);
  const [value_2, setValue_2] = useState(2);
  const theme = useTheme();
  const [format, setFormat] = useState({
    primaryTable:{
      stats:{
        type:"Daily",
        variety:"Page-Viewers"
      }
    },
    secondaryTable:true,
    header: true
  })

  const [backdrop, setbackdrop] = useState(false)
  const [imgHeader, setimgHeader] = useState({name:"*Nothing Selected*"})
  const [notification, setnotification] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [confirm, setconfirm] = useState(false)
  const [errorOpen, seterrorOpen] = useState(false)
  const [errormsg, seterror] = useState("");
  const navigate = useNavigate()

  const genButton = async () => {
    var IMAGE_BUFFER = "";

    if(format.header){
      if(imgHeader.size){
        setbackdrop(true)
        await getBase64(imgHeader, (result) => {
          IMAGE_BUFFER = result.split(",")[1]
          axios({
            method:'post',
            url:`${API_URL}/report/gen`,
            headers:{
              'x-auth-token': store.getState().auth.token
            },
            data:{
              list:store.getState().auth.list,
              format,
              headerImg:IMAGE_BUFFER
            }
          })
          .then(res=>{
            setconfirm(false)
            if(res.data.wait){
              seterror(res.data.msg)
              seterrorOpen(true)
            } else {
              setnotification(res.data.msg)        
              setNotificationOpen(true)
            }
            setTimeout(() => {
              setbackdrop(false);
              navigate('/app/report-gen')
            }, 3000);
          })
          .catch(err=>console.log(err))
        });
      } else alert("Upload header image first!")
    } else {
      setbackdrop(true)
      axios({
        method:'post',
        url:`${API_URL}/report/gen`,
        headers:{
          'x-auth-token': store.getState().auth.token
        },
        data:{
          list:store.getState().auth.list,
          format,
          headerImg:IMAGE_BUFFER
        }
      })
      .then(res=>{
        setconfirm(false)
        if(res.data.wait){
          seterror(res.data.msg)
          seterrorOpen(true)
        } else {
          setnotification(res.data.msg)        
          setNotificationOpen(true)
        }
        setTimeout(() => {
          setbackdrop(false);
          navigate('/app/report-gen')
        }, 3000);
      })
      .catch(err=>console.log(err))
    }
  }

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

  useEffect(() => {
    setnotification("Number of links in the list: "+store.getState().auth.list.length)
    setNotificationOpen(true)
  }, [])

  if(store.getState().auth.list.length!=0)
  return (
    <Page
      className={classes.root}
      title="Account"
    >
    <Backdrop className={classes.backdrop} open={backdrop}>
      <CircularProgress color="inherit" />
    </Backdrop>
    <Snackbar open={notificationOpen} autoHideDuration={4000} onClose={()=>setNotificationOpen(false)}>
      <Alert onClose={()=>setNotificationOpen(false)} elevation={6} variant="filled" severity="success">
        {notification}
      </Alert>
    </Snackbar>
    <Snackbar open={errorOpen} autoHideDuration={4000} onClose={()=>seterrorOpen(false)}>
      <Alert onClose={()=>seterrorOpen(false)} elevation={6} variant="filled" severity="error">
        {errormsg}
      </Alert>
    </Snackbar>
      <Container maxWidth="lg">
        <form
          autoComplete="off"
          noValidate
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Card>      
            <CardContent>
              <Typography gutterBottom variant="h3">Generate Report &gt; <small>Format</small> </Typography>
              <Divider/>              
              <Typography variant="body2">
                Upload Header Logo
                <Tooltip title={infoMEssages.headerLogoOption} placement="top">
                  <IconButton>
                    <InfoIcon/>
                  </IconButton>
                </Tooltip>
                <Switch
                  checked={format.header}
                  onChange={()=>{
                    if(format.header===false){
                      setimgHeader({name:"*Nothing Selected*"})
                    }
                    setFormat(prevState=>{
                      prevState.header=!prevState.header
                      return({...prevState})
                    })
                  }}
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              </Typography>
              <br/>
              {
                format.header?                 
                <Paper square>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      xs={12}
                    >
                    <IconButton
                      variant="contained"
                      component="label"
                      style={{marginLeft:"2rem"}}
                    >
                      <CloudUploadIcon/>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e)=>setimgHeader(e.target.files[0])}
                      />
                    </IconButton>
                    <Typography variant="caption">
                      <i> {imgHeader.name}</i>
                    </Typography>
                    </Grid>
                  </Grid>
                </Paper> : <Divider/> 
              }
              <br/>
              <br/>
              <Typography variant="body2">
                Primary table will contain following Columns
              </Typography>
              <Typography variant="caption">
                <i>* Represent Editable Fields</i>
              </Typography>
              <br/><br/>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xs={12}
                >
                  <Paper square>
                    <Tabs
                      value={value_1}
                      indicatorColor="primary"
                      textColor="primary"
                      // onChange={handleChangeTab}
                      aria-label="disabled tabs example"
                    >
                      <Tab label="S.No." disabled/>
                      <Tab label="Publisher" disabled/>
                      <Tab label="News Headline " disabled/>
                      <Tab label="Statistics *" />
                    </Tabs>
                    <SwipeableViews
                      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                      index={value_1}
                      //onChangeIndex={handleChangeIndex}
                    >
                      <TabPanel value={value_1} index={0} dir={theme.direction}>
                        Item One
                      </TabPanel>
                      <TabPanel value={value_1} index={1} dir={theme.direction}>
                        Item Two
                      </TabPanel>
                      <TabPanel value={value_1} index={2} dir={theme.direction}>
                        <Typography variant="body2">
                          Hyper Linking
                        </Typography>
                      </TabPanel>
                      <TabPanel value={value_1} index={3} dir={theme.direction}>
                        <Grid
                          container
                          spacing={3}
                        >
                          <Grid
                            item
                            xs={6}
                          >
                            <Typography variant="body2">
                              Statistics Type
                              <Tooltip title={infoMEssages.statsType} placement="right">
                                <IconButton>
                                  <InfoIcon/>
                                </IconButton>
                              </Tooltip>
                            </Typography>
                            <FormControl component="fieldset">
                              <RadioGroup aria-label="gender" value={format.primaryTable.stats.type} 
                              onChange={(e)=>setFormat(prevState=>{
                                    prevState.primaryTable.stats.type=e.target.value
                                    return({...prevState})
                                  }
                                )}
                              >
                                <FormControlLabel value="Daily" control={<Radio />} label="Daily" />
                                <FormControlLabel value="Monthly" control={<Radio />} label="Monthly" />
                                <FormControlLabel value="Yearly" control={<Radio />} label="Yearly" />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                          >
                            <Typography variant="body2">
                              Statistics Type
                              <Tooltip title={infoMEssages.userType} placement="right">
                                <IconButton>
                                  <InfoIcon/>
                                </IconButton>
                              </Tooltip>
                            </Typography>
                            <FormControl component="fieldset">
                              <RadioGroup aria-label="gender" value={format.primaryTable.stats.variety} 
                                onChange={(e)=>setFormat(prevState=>{
                                    prevState.primaryTable.stats.variety=e.target.value
                                    return({...prevState})
                                  }
                                )}
                              >
                                <FormControlLabel value="Page-Viewers" control={<Radio />} label="Page Viewers" />
                                <FormControlLabel value="Page-Visitors" control={<Radio />} label="Page Visitors" />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </TabPanel>
                    </SwipeableViews>
                  </Paper>
                </Grid>                
              </Grid>
              <br/>
              <Divider/>
              <br/>
              <Typography variant="body2">
                Secondary Section
                <Tooltip title={infoMEssages.secondaryButtonToggleInfo} placement="top">
                  <IconButton>
                    <InfoIcon/>
                  </IconButton>
                </Tooltip>
                <Switch
                  checked={format.secondaryTable}
                  onChange={()=>setFormat(prevState=>{
                      prevState.secondaryTable=!prevState.secondaryTable;
                      return({...prevState})
                    }
                  )}
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              </Typography>
              {
                format.secondaryTable ? (
                <>                 
                  <br/><br/>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      xs={12}
                    >
                      <Paper square>
                        <Tabs
                          value={value_2}
                          indicatorColor="primary"
                          textColor="primary"
                          // onChange={handleChangeTab2}
                          aria-label="disabled tabs example"
                        >
                          <Tab label="Publisher" disabled/>
                          <Tab label="News Headline" disabled/>
                          <Tab label="Statistics" />
                          <Tab label="Screenshot of Article" disabled/>
                        </Tabs>
                        <SwipeableViews
                          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                          index={value_2}
                          //onChangeIndex={handleChangeIndex2}
                        >
                          <TabPanel value={value_2} index={0} dir={theme.direction}>
                            Item Two
                          </TabPanel>
                          <TabPanel value={value_2} index={1} dir={theme.direction}>
                            <Typography variant="body2">
                              Hyper Linking
                            </Typography>
                          </TabPanel>
                          <TabPanel value={value_2} index={2} dir={theme.direction}>
                            <Grid
                              container
                              spacing={3}
                            >
                              <Grid
                                item
                                xs={6}
                              >
                                <Typography variant="body2">
                                  Statistics Type
                                  <Tooltip title={infoMEssages.secondaryTableSameInfo} placement="right">
                                    <IconButton>
                                      <InfoIcon/>
                                    </IconButton>
                                  </Tooltip>
                                </Typography>
                                <FormControl component="fieldset" disabled>
                                  <RadioGroup aria-label="gender" value={format.primaryTable.stats.type} 
                                  onChange={(e)=>setFormat(prevState=>{
                                        prevState.primaryTable.stats.type=e.target.value
                                        return({...prevState})
                                      }
                                    )}
                                  >
                                    <FormControlLabel value="Daily" control={<Radio />} label="Daily" />
                                    <FormControlLabel value="Monthly" control={<Radio />} label="Monthly" />
                                    <FormControlLabel value="Yearly" control={<Radio />} label="Yearly" />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                              <Grid
                                item
                                xs={6}
                              >
                                <Typography variant="body2">
                                  Statistics Type
                                  <Tooltip title={infoMEssages.secondaryTableSameInfo} placement="right">
                                    <IconButton>
                                      <InfoIcon/>
                                    </IconButton>
                                  </Tooltip>
                                </Typography>
                                <FormControl component="fieldset" disabled>
                                  <RadioGroup aria-label="gender" value={format.primaryTable.stats.variety} 
                                    onChange={(e)=>setFormat(prevState=>{
                                        prevState.primaryTable.stats.variety=e.target.value
                                        return({...prevState})
                                      }
                                    )}
                                  >
                                    <FormControlLabel value="Page-Viewers" control={<Radio />} label="Page Viewers" />
                                    <FormControlLabel value="Page-Visitors" control={<Radio />} label="Page Visitors" />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </TabPanel>
                        </SwipeableViews>
                      </Paper>
                    </Grid>                
                  </Grid>
                </>) : <><br/><Divider/></>
              }
            </CardContent>
            <CardActions style={{padding:"2rem 18rem"}}>
                <Button variant="contained" color="primary" fullWidth size="large" onClick={()=>{setconfirm(true)}}>
                  Generate Report
                </Button>
            </CardActions>
          </Card>
        </form>
        <Dialog
          open={confirm}
          TransitionComponent={Transition}
          keepMounted
          onClose={()=>setconfirm(false)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"Please confirm your actions"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to generate the report?<br/><br/>
              {(()=>{
                if(store.getState().auth.user.accountType==='Trial')
                  return (
                    <>
                      <b>Usable Credits: </b> {store.getState().auth.user.plan.limitLeft}<br/>
                      <b>Credits Required: </b> {store.getState().auth.list.length}<br/>
                      <b>Credits left after use <i>(Extected)</i>: </b> {store.getState().auth.user.plan.limitLeft-store.getState().auth.list.length}<br/><br/>
                    </>
                  )
                else return(
                  <>
                    <b>Number of Links in File: </b> {store.getState().auth.list.length}<br/><br/>
                  </>
                )
              })()}              
              <i><small>( You will receive the report on <b>"{store.getState().auth.user.email}"</b> in<b> Approx. {Math.round((store.getState().auth.list.length/3)*10)/10} mins</b> )</small></i>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setconfirm(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={()=>genButton()} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  ) 
  else return <Navigate to="/app/report-gen"/>
};

FormatForm.propTypes = {
  className: PropTypes.string
};

const mapStateToProps = state => ({
  user:state.auth.user
})

export default connect(mapStateToProps,null)(FormatForm);