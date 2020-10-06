import React, { useState , useEffect , useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, Button, Card, CardContent, CardHeader, Container, Divider, Grid, TextField, makeStyles , Typography, Paper, Tabs, Tab , useTheme , Switch , Tooltip , IconButton , Radio, RadioGroup, FormControlLabel, FormControl, FormLabel , CardActions} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import InfoIcon from '@material-ui/icons/Info';

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
  headlineHyperlink:"Enable this option if you want the Article Heading to be Hyperlinked",
  statsType:"Select the type of Statistic you want to add in the report",
  userType:"Select the Statistic variety",
  secondaryButtonToggleInfo:"Enable secondary section",
  secondaryTableSameInfo:"This value depends upon primary section detailes"
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
  const [value_1, setValue_1] = useState(2);
  const [index_1, setIndex_1] = useState(0);
  const [value_2, setValue_2] = useState(1);
  const [index_2, setIndex_2] = useState(0);
  const theme = useTheme();
  const [format, setFormat] = useState({
    primaryTable:{
      headlineHyperlink: true,
      stats:{
        type:"Daily",
        variety:"Page-Viewers"
      }
    },
    secondaryTable:{
      required:true,
      screenShot:true
    }
  })
  const [secTable, setsecTable] = useState(true)

  const handleChangeTab = (event, newValue) => {
    setValue_1(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue_1(index);
  };

  const handleChangeTab2 = (event, newValue) => {
    setValue_2(newValue);
  };

  const handleChangeIndex2 = (index) => {
    setValue_2(index);
  };

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
                      onChange={handleChangeTab}
                      aria-label="disabled tabs example"
                    >
                      <Tab label="S.No." disabled/>
                      <Tab label="Publisher" disabled/>
                      <Tab label="News Headline *" />
                      <Tab label="Statistics *" />
                    </Tabs>
                    <SwipeableViews
                      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                      index={value_1}
                      onChangeIndex={handleChangeIndex}
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
                          <Tooltip title={infoMEssages.headlineHyperlink} placement="right">
                            <IconButton>
                              <InfoIcon/>
                            </IconButton>
                          </Tooltip>
                        </Typography>
                        <Switch
                          checked={format.primaryTable.headlineHyperlink}
                          onChange={()=>setFormat(prevState=>{
                              prevState.primaryTable.headlineHyperlink=!prevState.primaryTable.headlineHyperlink;
                              return({...prevState})
                            }
                          )}
                          color="primary"
                          name="primaryTable.headlineHyperlink"
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
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
              <br/><br/>
              <Typography variant="body2">
                Secondary Section
                <Tooltip title={infoMEssages.secondaryButtonToggleInfo} placement="top">
                  <IconButton>
                    <InfoIcon/>
                  </IconButton>
                </Tooltip>
                <Switch
                  checked={secTable}
                  onChange={()=>setsecTable(!secTable)}
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              </Typography>
              {
                secTable ? (
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
                          onChange={handleChangeTab2}
                          aria-label="disabled tabs example"
                        >
                          <Tab label="Publisher" disabled/>
                          <Tab label="News Headline" />
                          <Tab label="Statistics" />
                          <Tab label="Screenshot of Article" disabled/>
                        </Tabs>
                        <SwipeableViews
                          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                          index={value_2}
                          onChangeIndex={handleChangeIndex2}
                        >
                          <TabPanel value={value_2} index={0} dir={theme.direction}>
                            Item Two
                          </TabPanel>
                          <TabPanel value={value_2} index={1} dir={theme.direction}>
                            <Typography variant="body2">
                              Hyper Linking
                              <Tooltip title={infoMEssages.secondaryTableSameInfo} placement="right">
                                <IconButton>
                                  <InfoIcon/>
                                </IconButton>
                              </Tooltip>
                            </Typography>
                            <Switch
                              checked={format.primaryTable.headlineHyperlink}                              
                              color="primary"
                              inputProps={{ 'aria-label': 'primary checkbox' }}
                              disabled
                            />
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
                </>)
                : ""
              }
            </CardContent>
            <CardActions style={{padding:"2rem 18rem"}}>
                <Button variant="contained" color="primary" fullWidth size="large">
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
