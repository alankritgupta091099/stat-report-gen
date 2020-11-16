import React, { useState , useEffect , useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardContent, CardHeader, Divider, Grid, TextField, makeStyles } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = (props) => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const userProp = useRef(props.user)

  const [values, setValues] = useState({
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Mobile Number",
    type: "Account Type",
    cost: 0,
    validFrom: moment(),
    limit:0,
    limitLeft:0
  });

  useEffect(() => {
    userProp.current=props.user;
    if(userProp.current){
      setValues({
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        email: props.user.email,
        phone: props.user.mobNumber,
        type: props.user.accountType,
        cost: props.user.plan.cost,
        validFrom: moment(props.user.plan.validFrom).format('DD/MM/YYYY'),
        limit: props.user.plan.limit,
        limitLeft: props.user.plan.limitLeft
      })    
    }    
  }, [props.user])

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="The information can not be edited"
          title="Profile"
        />
        <Divider />
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
                variant="outlined"
                disabled
                id="outlined-disabled"
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
                value={values.lastName}
                variant="outlined"
                disabled
                id="outlined-disabled"
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
                value={values.email}
                variant="outlined"
                disabled
                id="outlined-disabled"
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
                value={values.phone}
                variant="outlined"
                disabled
                id="outlined-disabled"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Account Type"
                name="type"
                value={values.type}
                variant="outlined"
                disabled
                id="outlined-disabled"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <br/>
      <Card>
        <CardHeader
          subheader="The information can not be edited"
          title="Plan"
        />
        <Divider />
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
                label="Cost"
                name="cost"
                value={values.cost}
                variant="outlined"
                disabled
                id="outlined-disabled"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Valid From"
                name="validFrom"
                value={values.validFrom}
                variant="outlined"
                disabled
                id="outlined-disabled"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Credit Limit"
                name="limit"
                value={values.limit}
                variant="outlined"
                disabled
                id="outlined-disabled"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Credits Left"
                name="limitLeft"
                value={values.limitLeft}
                variant="outlined"
                disabled
                id="outlined-disabled"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

const mapStateToProps = state => ({
  user:state.auth.user
})

export default connect(mapStateToProps,null)(ProfileDetails);
