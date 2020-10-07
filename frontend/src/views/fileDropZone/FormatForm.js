import React, { useState , useEffect , useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, Button, Card, CardContent, CardHeader, Container, Divider, Grid, TextField, makeStyles , Typography, Paper, Tabs, Tab , useTheme , Switch , Tooltip , IconButton , Radio, RadioGroup, FormControlLabel, FormControl, FormLabel , CardActions , Fab } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';

import InfoIcon from '@material-ui/icons/Info';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ClearIcon from '@material-ui/icons/Clear';

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
  }
}));

const FormatForm = (props) => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const userProp = useRef(props.user)
  const [value_1, setValue_1] = useState(3);
  const [index_1, setIndex_1] = useState(0);
  const [value_2, setValue_2] = useState(2);
  const [index_2, setIndex_2] = useState(0);
  const theme = useTheme();
  const [format, setFormat] = useState({
    primaryTable:{
      stats:{
        type:"Daily",
        variety:"Page-Viewers"
      }
    },
    secondaryTable:true
  })
  const [Header, setHeader] = useState(true)

  // const handleChangeTab = (event, newValue) => {
  //   setValue_1(newValue);
  // };

  // const handleChangeIndex = (index) => {
  //   setValue_1(index);
  // };

  // const handleChangeTab2 = (event, newValue) => {
  //   setValue_2(newValue);
  // };

  // const handleChangeIndex2 = (index) => {
  //   setValue_2(index);
  // };

  return (
    <Page
      className={classes.root}
      title="Account"
    >
      <Container maxWidth="lg">
        <form
          autoComplete="off"
          noValidate
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Card>
            <CardHeader
              title="Format your Report"
            />
            <Divider />            
            <CardContent>
              <Typography variant="body2">
                Upload Header Logo
                <Tooltip title={infoMEssages.headerLogoOption} placement="top">
                  <IconButton>
                    <InfoIcon/>
                  </IconButton>
                </Tooltip>
                <Switch
                  checked={Header}
                  onChange={()=>{
                    setHeader(!Header)
                    if(Header===false) 
                      props.setimgHeader({name:"*Nothing Selected*"})
                  }}
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              </Typography>
              <br/>
              {
                Header ?                 
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
                        onChange={(e)=>props.setimgHeader(e.target.files[0])}
                      />
                    </IconButton>
                    <Typography variant="caption">
                      <i> {props.imgHeader.name}</i>
                    </Typography>
                    <IconButton onClick={()=>props.setimgHeader({name:"*Nothing Selected*"})}>
                      <ClearIcon/>
                    </IconButton>                    
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
                <Button variant="contained" color="primary" fullWidth size="large" onClick={()=>props.genButton(format)}>
                  Generate Report
                </Button>
            </CardActions>
          </Card>
        </form>
      </Container>
    </Page>
  );
};

FormatForm.propTypes = {
  className: PropTypes.string
};

const mapStateToProps = state => ({
  user:state.auth.user
})

export default connect(mapStateToProps,null)(FormatForm);
