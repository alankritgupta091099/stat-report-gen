import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  }
];

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = (props) => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState({
    firstName: props.user.firstName,
    lastName: props.user.lastName,
    email: props.user.email,
    phone: props.user.mobNumber,
    type: props.user.accountType,
    //add account validity
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

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
