import React , { useState , useEffect } from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Alert from '@material-ui/lab/Alert';
import { Box , Button , Container , Grid , Link , Snackbar , TextField , Typography , makeStyles } from '@material-ui/core';

import Page from 'src/components/Page';
import { loginUser } from 'src/actions/authActions.js';
import { clearNotifications } from 'src/actions/notificationActions.js';
import { clearErrors } from 'src/actions/errorActions.js';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  formStyle:{
    backgroundColor: theme.palette.background.default,
    border: '2px solid '+theme.palette.primary.main,
    borderRadius: '15px'
  }
}));

const LoginView = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [notification, setnotification] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if(props.notification.id=="LOGIN_SUCCESS"){
      setNotificationOpen(true);
      setnotification(props.notification.msg);
      setTimeout(() => {
        setnotification("");
        props.clearNotifications();
        navigate('/app/dashboard', { replace: true });
      }, 900);
    }
  }, [props.notification])

  useEffect(() => {    
    if(props.error.id=="LOGIN_FAIL"){
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
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Snackbar open={notificationOpen} autoHideDuration={900} onClose={()=>setNotificationOpen(false)}>
          <Alert onClose={()=>setNotificationOpen(false)} elevation={6} variant="filled" severity="success">
            {notification}
          </Alert>
        </Snackbar>
        <Snackbar open={error} autoHideDuration={2000} onClose={()=>setError(false)}>
          <Alert onClose={()=>setError(false)} elevation={6} variant="filled" severity="error">
            {props.error.msg}
          </Alert>
        </Snackbar>
        <Container maxWidth="sm" className={classes.formStyle}>
          <Formik
            initialValues={{
              email: 'demo@devias.io',
              password: 'Password123'
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values,{setSubmitting}) => {
              props.loginUser(values)
              setSubmitting(false)
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit} style={{padding:'1.5rem'}}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Sign in
                  </Typography>
                </Box>
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
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don&apos;t have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Contact Us
                  </Link>
                </Typography>
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

export default connect(mapStateToProps,{ loginUser , clearNotifications , clearErrors })(LoginView);
