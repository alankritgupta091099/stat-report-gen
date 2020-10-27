import React, { useState , useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Avatar, Box, Button, Card, Checkbox, TextField, TableContainer, Table, TableBody, TableCell, TableHead, TablePagination, TableRow,  Typography, makeStyles , CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, CardContent , DialogTitle , CardHeader, Grid ,Divider, FormControl, InputLabel, Select, MenuItem , Snackbar , Container , Paper} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import axios from 'axios';

import { API_URL } from 'src/helpers/utils.js';
import store from "src/store.js";

const useStyles = makeStyles((theme) => ({
  root: {},
  formControl: {
    minWidth: 428,
  },
  center:{
    margin: '2rem 0 2rem 2rem'
  }
}));

const Results = ({ className, customers, getAllCustomers, getSelectedCustomers, istableData, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [customerslist, setcustomerslist] = useState(null)
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = useState({
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Mobile Number",
    type: "Account Type",
    orgName: "Organisation Name",
    orgPos: "Organisation Position",
    cost:0,
    validFrom: moment(Date.now()),
    limit:0,
    limitLeft:0
  });
  const [selectedID, setselectedID] = useState("");
  const [notification, setnotification] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [error, setError] = useState(false);
  const [historyDialog, sethistoryDialog] = useState(false)
  const [history, sethistory] = useState([])
  const [validfrom, setvalidfrom] = useState(new Date())

  const handleClickOpen = ( event, id) => {
    setselectedID(id)
    var customer="";
    if(getSelectedCustomers.length!==0)    
      customer=getSelectedCustomers.find((item)=>{
        return item._id === id
      })
    else 
      customer=getAllCustomers.find((item)=>{
        return item._id === id
      })
    setValues({
      firstName:customer.firstName,
      lastName:customer.lastName,
      email:customer.email,
      phone:customer.mobNumber,
      type:customer.accountType,
      orgName:customer.orgName,
      orgPos:customer.orgPosition,
      cost:customer.plan.cost,
      validFrom:customer.plan.validFrom,
      limit:customer.plan.limit,
      limitLeft:customer.plan.limitLeft
    })
    setOpen(true);
  };

  const handleHistoryclickOpen = (id) => {
    var customer = "";
    if(getSelectedCustomers.length!==0)    
      customer=getSelectedCustomers.find((item)=>{
        return item._id === id
      })
    else 
      customer=getAllCustomers.find((item)=>{
        return item._id === id
      })
    sethistory(customer.coveragesScanned)
    setvalidfrom(customer.plan.validFrom)
    sethistoryDialog(true)
  }

  const handleClose = () => {
    setOpen(false);
    sethistoryDialog(false);
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value,10));
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSubmit = () => {
    axios({
        method:'post',
        url:`${API_URL}/post/customer/${selectedID}`,
        headers:{'x-auth-token': store.getState().auth.token},
        data: values
      })
      .then((result) => {
        console.log(values)
        setnotification(values.email+" Updated!!")
        setNotificationOpen(true);
        window.location.reload();
        setOpen(false);
      }).catch((err) => {
        console.log(err)
      });
  }

  return (
    <>
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    > 
    <Snackbar open={notificationOpen} autoHideDuration={2000} onClose={()=>setNotificationOpen(false)}>
        <Alert onClose={()=>setNotificationOpen(false)} elevation={6} variant="filled" severity="success">
          {notification}
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={2000} onClose={()=>setError(false)}>
        <Alert onClose={()=>setError(false)} elevation={6} variant="filled" severity="error">
          {"Something went wrong"}
        </Alert>
      </Snackbar>
      <PerfectScrollbar>
        <Box minWidth={1550}>
          <Table aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Organisation
                </TableCell>
                <TableCell>
                  Account Status
                </TableCell>
                <TableCell>
                  Cost
                </TableCell>
                <TableCell>
                  Valid From<br/><small><i>(DD/MM/YYYY)</i></small>
                </TableCell>
                <TableCell>
                  Credit Limit
                </TableCell>
                <TableCell>
                  Credits Left
                </TableCell>
                <TableCell/>
                <TableCell/>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Mobile number
                </TableCell>
                <TableCell>
                  Designation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                (getSelectedCustomers.length!==0) ? 
                  !istableData ? 
                    <Typography variant="h5" className={classes.center}>
                      No match found
                    </Typography> :
                    getSelectedCustomers.slice(page * limit, page * limit + limit).map((customer) =>{                   
                    return (
                      <TableRow
                        hover
                        key={customer._id}
                      >
                        <TableCell>
                          {customer.firstName +" "+ customer.lastName}
                        </TableCell>
                        <TableCell> 
                          {customer.orgName}
                        </TableCell>
                        <TableCell>
                          {customer.accountType}
                        </TableCell>
                        <TableCell>
                          {customer.plan.cost}
                        </TableCell>
                        <TableCell>
                          {moment(customer.plan.validFrom).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell>
                          {customer.plan.limit}
                        </TableCell>
                        <TableCell>
                          {customer.plan.limitLeft}
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" size="small" color="primary" onClick={event=>handleHistoryclickOpen(customer._id)} >
                            History
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant="contained" size="small" color="primary" onClick={event=>handleClickOpen(event,customer._id)}>
                            Edit
                          </Button>
                        </TableCell>
                        <TableCell>
                          {customer.email}
                        </TableCell>
                        <TableCell>
                          {customer.mobNumber}
                        </TableCell>
                        <TableCell>
                          {customer.orgPosition}
                        </TableCell>
                      </TableRow>
                     )}) :
                getAllCustomers ? getAllCustomers.slice(page * limit, page * limit + limit).map((customer) =>{                   
                  return (
                <TableRow
                  hover
                  key={customer._id}
                >
                  <TableCell>
                    {customer.firstName +" "+ customer.lastName}
                  </TableCell>
                  <TableCell> 
                    {customer.orgName}
                  </TableCell>
                  <TableCell>
                    {customer.accountType}
                  </TableCell>
                  <TableCell>
                    {customer.plan.cost}
                  </TableCell>
                  <TableCell>
                    {moment(customer.plan.validFrom).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {customer.plan.limit}
                  </TableCell>
                  <TableCell>
                    {customer.plan.limitLeft}
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" color="primary" onClick={event=>handleHistoryclickOpen(customer._id)} >
                      History
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" size="small" color="primary" onClick={event=>handleClickOpen(event,customer._id)}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    {customer.email}
                  </TableCell>
                  <TableCell>
                    {customer.mobNumber}
                  </TableCell>
                  <TableCell>
                    {customer.orgPosition}
                  </TableCell>
                </TableRow>
              )}) : <CircularProgress style={{position:'fixed',margin:'1% 36%'}}/>
              }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={(getSelectedCustomers.length===0) ? getAllCustomers.length : getSelectedCustomers.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" maxWidth="md">
        <DialogContent>
          <form
            autoComplete="off"
          >
              <CardHeader
                subheader="Account Information"
                title="Customer Details"
              />
              <Divider/>
              <br/>
              <CardContent>
                <Grid
                  container
                  spacing={3}
                > 
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="demo-simple-select-outlined-label">Account Type</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={values.type}
                        name="type"
                        onChange={(e)=>{
                          if(e.target.value==='Trial'){
                            setValues({
                              ...values,
                              cost:0,
                              limit:250,
                              [e.target.name]: e.target.value
                            })                            
                          } else setValues({
                            ...values,
                            [e.target.name]: e.target.value
                          })
                        }}
                        label="Account Type"
                        autoFocus
                      >
                        <MenuItem value="Trial">Trial</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Expired">Expired</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >                
                    <FormControl variant="outlined" className={classes.formControl}>
                      <TextField //disable this section and set it to 0 when account type is not paid
                        fullWidth
                        label="Cost"
                        name="cost"
                        onChange={handleChange}
                        value={values.cost}
                        variant="outlined"
                        disabled={(values.type==='Trial'||values.type==='Expired')?true:false}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >                    
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <FormControl variant="outlined" className={classes.formControl} fullWidth>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="DD/MM/YYYY"
                        margin="normal"
                        label="Account Valid From"
                        name="validFrom"
                        value={values.validFrom}
                        onChange={date=>setValues({...values,validFrom:moment(date).format()})}
                        KeyboardButtonProps = {{
                          'aria-label': 'change date',
                        }}
                        inputVariant="outlined"
                        minDate={values.validFrom}
                      />   
                    </FormControl>
                  </MuiPickersUtilsProvider> 
                  </Grid>
                  <Grid item md={6} xs={12}>
                  <br/>
                    <FormControl variant="outlined" className={classes.formControl} fullWidth>
                      <TextField
                        label="Credit Limit"
                        name="limit"
                        onChange={(e)=>{
                          setValues({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                        }}
                        value={values.limit}
                        variant="outlined"
                        type="number"
                        InputProps={{ inputProps: { min: 0} }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                  <br/>
                    <FormControl variant="outlined" className={classes.formControl} fullWidth>
                      <TextField
                        label="Credits Left"
                        value={values.limitLeft}
                        variant="outlined"
                        type="number"
                        disabled
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
              <br/>
              <Divider/>
              <CardHeader
                subheader="Personal Information"
              />
              <Divider/>
              <br/>
              <CardContent>                
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="First name"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      variant="outlined"                      
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Last name"
                      name="lastName"
                      onChange={handleChange}
                      value={values.lastName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      onChange={handleChange}
                      value={values.email}
                      variant="outlined"
                      disabled
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      onChange={handleChange}
                      value={values.phone}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Organisation Name"
                      name="orgName"
                      onChange={handleChange}
                      value={values.orgName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Designation"
                      name="orgPos"
                      onChange={handleChange}
                      value={values.orgPos}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <br/>
              <Divider/>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    <div>
       <Dialog
        maxWidth={"xl"}
        fullWidth={true}
        open={historyDialog}
        onClose={handleClose}
        scroll={'paper'}
      >
        <DialogTitle id="scroll-dialog-title">User History</DialogTitle>
        <DialogContent dividers={'paper'}>
          <TableContainer component={Paper}>
              <Table stickyHeader>
                  <TableHead>
                  <TableRow>
                      <TableCell>Links Requested</TableCell>
                      <TableCell>Links Generated</TableCell>
                      <TableCell>Mailing Date</TableCell>
                      <TableCell>Mailing Time</TableCell>                            
                  </TableRow>
                  </TableHead>
                  <TableBody>
                  {/* Add search bar here */}
                  { history.length === 0 ? <Typography variant="h5" className={classes.center}>
                      No data to show
                    </Typography> : history.map((row) => (
                      (!moment(row.time).isBefore(validfrom)) ? <TableRow>
                          <TableCell component="th" scope="row">
                              {row.listLength}
                          </TableCell>
                          <TableCell component="th" scope="row">
                              {row.count}
                          </TableCell>
                          <TableCell>{moment(row.time).format('DD MMM YYYY')}</TableCell>
                          <TableCell>{moment(row.time).format('LT')}</TableCell>
                      </TableRow> : <TableRow>
                          <TableCell component="th" scope="row">
                              {row.listLength}<i>(Old)</i> 
                          </TableCell>
                          <TableCell component="th" scope="row">
                              {row.count}
                          </TableCell>
                          <TableCell>{moment(row.time).format('DD MMM YYYY')}</TableCell>
                          <TableCell>{moment(row.time).format('LT')}</TableCell>
                      </TableRow>
                  ))}
                  </TableBody>
              </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default Results;
