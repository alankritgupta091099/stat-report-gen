import React , { useState , useEffect } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Alert from '@material-ui/lab/Alert';
import { Box , Button , Container , Grid , Link , Snackbar , TextField , Typography , makeStyles , IconButton } from '@material-ui/core';
import axios from 'axios';
import { useNavigate , Navigate } from 'react-router-dom';

import Page from 'src/components/Page';
import { API_URL } from '../../helpers/utils.js';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

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

const ResetPasswordview = (props) => {
  const classes = useStyles();
  const [notification, setnotification] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errormsg, seterrormsg] = useState("")
  const [passwordMask, setpasswordMask] = useState("text")
  const navigate = useNavigate()

  useEffect(() => {
  var link = window.location.pathname.split('/')
  console.log(link)
  axios.post(`${API_URL}/post/user/checkReset`,{userId:link[2],token:link[3]})
  .catch(err=>{
    console.log(err)    
    setError(true);
    seterrormsg("Invalid Route")
    setTimeout(() => {
      navigate('/404')
    }, 800);
  })  
}, [])

  return (
    <Page
      className={classes.root}
      title="Reset Password"
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
              password: ''
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values,{setSubmitting}) => {
              var link = window.location.pathname.split('/')
              axios.post(`${API_URL}/post/user/reset`,{values,userId:link[2],token:link[3]})
              .then(res=>{
                setNotificationOpen(true);
                setnotification(res.data.msg);
                setTimeout(() => {
                  navigate('/login')
                }, 2000);
              })
              .catch(err=>{
                setError(true);
                seterrormsg("Invalid Route")
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
                    Reset Your Password
                  </Typography>
                </Box>
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
                  type={passwordMask}
                  InputProps={{endAdornment: <><IconButton size="small" onClick={()=>(passwordMask=="text") ? setpasswordMask("password") : setpasswordMask("text")}>{(passwordMask=="text") ? <VisibilityIcon/> : <VisibilityOffIcon/>}</IconButton></>}}
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

export default ResetPasswordview;
