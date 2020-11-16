import React , { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Alert from '@material-ui/lab/Alert';
import { Box , Button , Container , Snackbar , TextField , Typography , makeStyles } from '@material-ui/core';
import axios from 'axios';

import Page from 'src/components/Page';
import { API_URL } from '../../helpers/utils.js';

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

const ForgotView = (props) => {
  const classes = useStyles();
  const [notification, setnotification] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errormsg, seterrormsg] = useState("")

  return (
    <Page
      className={classes.root}
      title="Forgot Password"
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
            {errormsg}
          </Alert>
        </Snackbar>
        <Container maxWidth="sm" className={classes.formStyle}>
          <Formik
            initialValues={{
              email: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),              
            })}
            onSubmit={(values,{setSubmitting}) => {
              axios.post(`${API_URL}/post/user/forgot`,values)
              .then(res=>{
                setNotificationOpen(true);
                setnotification(res.data.msg);
              })
              .catch(err=>{
                setError(true);
                seterrormsg("User does not exist")
              })    
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
                    Forgot Password
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
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Reset password
                  </Button>
                </Box>                
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default ForgotView;
