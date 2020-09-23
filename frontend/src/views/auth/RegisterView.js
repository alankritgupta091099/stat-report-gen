import React , { useState , useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import { Box , Button , Checkbox , Container, FormHelperText , Grid , Link , Snackbar , TextField , Typography , makeStyles } from '@material-ui/core';

import Page from 'src/components/Page';
import { registerUser } from 'src/actions/authActions.js';
import { clearNotifications } from 'src/actions/notificationActions.js';
import { clearErrors } from 'src/actions/errorActions.js';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: 'auto',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(4),
  },
  formStyle:{
    backgroundColor: theme.palette.background.default,
    border: '2px solid '+theme.palette.primary.main,
    borderRadius: '15px'
  }
}));

const RegisterView = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [notification, setnotification] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [error, setError] = useState(false);

  const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setnotification("");
    props.clearNotifications()
    setNotificationOpen(false);
  };

  useEffect(() => {
    if(props.notification.id=="REGISTER_SUCCESS"){
      setNotificationOpen(true);
      setnotification(props.notification.msg);
      setTimeout(() => {
        setnotification("");
        props.clearNotifications();
      }, 2000);
    }
  }, [props.notification])

  useEffect(() => {    
    if(props.error.id=="REGISTER_FAIL"){
      setError(true);
      setTimeout(() => {
        setError(false);
        props.clearErrors();
      }, 2000);
    }
  }, [props.error])

  return (
    <Page
      className={classes.root}
      title="Register"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
      <Snackbar open={notificationOpen} autoHideDuration={2000} onClose={()=>setNotificationOpen(false)}>
        <Alert onClose={()=>setNotificationOpen(false)} elevation={6} variant="filled" severity="success">
          {notification}
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={2000} onClose={()=>setError(false)}>
        <Alert onClose={()=>setError(false)} elevation={6} variant="filled" severity="error">
          {props.error.msg}
        </Alert>
      </Snackbar>
        <Container maxWidth="md" className={classes.formStyle}>
          <Formik            
            initialValues={{
              email: '',
              firstName: '',
              lastName: '',
              orgName:'',
              orgPosition:'',
              mobNumber:'',
              password: ''
            }}
            validationSchema={
              Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                firstName: Yup.string().max(255).required('First name is required'),
                lastName: Yup.string().max(255).required('Last name is required'),
                orgName: Yup.string().max(255).required('Organisation name is required'),
                orgPosition: Yup.string().max(255).required('Position in organisation is required'),
                mobNumber: Yup.string().required('Mobile Number is required').matches(phoneRegExp, 'Phone number is not valid'),
                password: Yup.string().max(255).required('Password is required')
              })
            }
            onSubmit = {(values,{setSubmitting,resetForm})=>{
              props.registerUser(values)
              resetForm({})
              setSubmitting(false);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              handleReset,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit} style={{padding:'1rem'}}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography
                      color="textPrimary"
                      variant="h2"
                    >
                      Create new account
                    </Typography>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      Fill the following details to create a new account
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      error={Boolean(touched.firstName && errors.firstName)}
                      fullWidth
                      helperText={touched.firstName && errors.firstName}
                      label="First name"
                      margin="normal"
                      name="firstName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      error={Boolean(touched.lastName && errors.lastName)}
                      fullWidth
                      helperText={touched.lastName && errors.lastName}
                      label="Last name"
                      margin="normal"
                      name="lastName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.orgName && errors.orgName)}
                      fullWidth
                      helperText={touched.orgName && errors.orgName}
                      label="Organisation Name"
                      margin="normal"
                      name="orgName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.orgName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.orgPosition && errors.orgPosition)}
                      fullWidth
                      helperText={touched.orgPosition && errors.orgPosition}
                      label="Position in Organisation"
                      margin="normal"
                      name="orgPosition"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.orgPosition}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label="Email Address"
                      margin="normal"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="email"
                      value={values.email}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>{/*Mobile number validation including country code*/}
                    <TextField
                      error={Boolean(touched.mobNumber && errors.mobNumber)} 
                      fullWidth
                      helperText={touched.mobNumber && errors.mobNumber}
                      label="Mobile Number"
                      margin="normal"
                      name="mobNumber"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.mobNumber}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>{/*Add Auto generate password*/} {/*Forget password section*/}
                    <TextField
                      error={Boolean(touched.password && errors.password)}
                      fullWidth
                      helperText={touched.password && errors.password}
                      label="Password"
                      margin="normal"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.password}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Create New Account
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

const mapStateToProps = state => ({
  notification:state.notification,
  error:state.error
})


export default connect(mapStateToProps, { registerUser , clearNotifications , clearErrors })(RegisterView);
