import React, { useState , useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Avatar, Box, Button, Card, Checkbox, TextField, TableContainer, Table, TableBody, TableCell, TableHead, TablePagination, TableRow,  Typography, makeStyles , CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, CardContent, CardHeader, Grid ,Divider, FormControl, InputLabel, Select, MenuItem , Snackbar} from '@material-ui/core';
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
  }
}));

const Results = ({ className, customers, ...rest }) => {
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
    validUntil: moment(Date.now())
  });
  const [selectedID, setselectedID] = useState("");
  const [notification, setnotification] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [error, setError] = useState(false);

  const handleClickOpen = ( event, id) => {
    setselectedID(id)
    var customer = customerslist.find((item)=>{
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
      validUntil:customer.plan.validUntil
    })
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  // const handleSelectAll = (event) => {
  //   let newSelectedCustomerIds;

  //   if (event.target.checked) {
  //     newSelectedCustomerIds = customerslist.map((customer) => customer._id);
  //   } else {
  //     newSelectedCustomerIds = [];
  //   }

  //   setSelectedCustomerIds(newSelectedCustomerIds);
  // };

  // const handleSelectOne = (event, id) => {
  //   const selectedIndex = selectedCustomerIds.indexOf(id);
  //   let newSelectedCustomerIds = [];

  //   if (selectedIndex === -1) {
  //     newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
  //   } else if (selectedIndex === 0) {
  //     newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
  //   } else if (selectedIndex === selectedCustomerIds.length - 1) {
  //     newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelectedCustomerIds = newSelectedCustomerIds.concat(
  //       selectedCustomerIds.slice(0, selectedIndex),
  //       selectedCustomerIds.slice(selectedIndex + 1)
  //     );
  //   }

  //   setSelectedCustomerIds(newSelectedCustomerIds);
  // };

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

  useEffect(() => {
    axios({
        method:'get',
        url:`${API_URL}/get/customers/all`,
        headers:{'x-auth-token': store.getState().auth.token}
      })
      .then((result) => {
        setcustomerslist(result.data)
      }).catch((err) => {
        console.log(err)
      });
  }, [])

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
        <Box minWidth={1050}>
          <Table aria-label="sticky table">
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === (customerslist ? customerslist.length : 0)}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < (customerslist ? customerslist.length : 0)
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell>
                  Organisation
                </TableCell>
                <TableCell>
                  Designation
                </TableCell>
                <TableCell>
                  Account Type
                </TableCell>
                <TableCell>
                  Cost
                </TableCell>
                <TableCell>
                  Valid From<br/><small><i>(DD/MM/YYYY)</i></small>
                </TableCell>
                <TableCell>
                  Valid Uptil<br/><small><i>(DD/MM/YYYY)</i></small>
                </TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                customerslist ? customerslist.slice(page * limit, page * limit + limit).map((customer) => (
                <TableRow
                  hover
                  key={customer._id}
                  // selected={selectedCustomerIds.indexOf(customer._id) !== -1}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(customer._id) !== -1}
                      onChange={(event) => handleSelectOne(event, customer._id)}
                      value="true"
                    />
                  </TableCell> */}
                  <TableCell>
                    {customer.firstName +" "+ customer.lastName}
                  </TableCell>
                  <TableCell>
                    {customer.email}
                  </TableCell>
                  <TableCell>
                    {customer.mobNumber}
                  </TableCell>
                  <TableCell>
                    {customer.orgName}
                  </TableCell>
                  <TableCell>
                    {customer.orgPosition}
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
                    {moment(customer.plan.validUntil).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" size="small" color="primary" onClick={event=>handleClickOpen(event,customer._id)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              )) : <CircularProgress style={{position:'fixed',margin:'1% 36%'}}/>
              }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={customerslist ? customerslist.length : 0}
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
              <CardContent>
                <Grid
                  container
                  spacing={3}
                >
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >                    
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
                    />                  
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >                    
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="DD/MM/YYYY"
                      margin="normal"
                      label="Account Valid Until"
                      name="validUntil"
                      value={values.validUntil}
                      onChange={date=>setValues({...values,validUntil:moment(date).format()})}
                      KeyboardButtonProps = {{
                        'aria-label': 'change date',
                      }}
                      minDate={moment(values.validFrom)}
                    />                  
                  </Grid>
                </MuiPickersUtilsProvider>
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
                        onChange={handleChange}
                        label="Account Type"
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
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider/>
              <CardHeader
                subheader="Personal Information"
              />
              <Divider/>
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
                      autoFocus
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
    </>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default Results;
