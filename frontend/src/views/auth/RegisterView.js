import React , { useState , useEffect , useRef } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import { Box , Button , Container, Grid , Snackbar , TextField , Typography , makeStyles , Card , CardContent , Divider , Select , MenuItem , FormControl , InputLabel , IconButton } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import Page from 'src/components/Page';
import { registerUser } from 'src/actions/authActions.js';
import { clearNotifications } from 'src/actions/notificationActions.js';
import { clearErrors } from 'src/actions/errorActions.js';
import Unauthorized from 'src/views/errors/unauthorized.js'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: 'auto',
    padding: theme.spacing(3),
  }
}));

const RegisterView = (props) => {
  const classes = useStyles();
  const [notification, setnotification] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState("")
  const [passwordMask, setpasswordMask] = useState("text")

  const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

  const userProp = useRef(props.user)

  useEffect(() => {    
    userProp.current=props.user;    
    if(userProp.current){
      setUser(userProp.current.accountType)
    }
  }, [props.user])

  useEffect(() => {
    if(props.notification.id==="REGISTER_SUCCESS"){
      setNotificationOpen(true);
      setnotification(props.notification.msg);
      setTimeout(() => {
        setnotification("");
        props.clearNotifications();
      }, 2000);
    }
  }, [props.notification])

  useEffect(() => {    
    if(props.error.id==="REGISTER_FAIL"){
      setError(true);
      setTimeout(() => {
        setError(false);
        props.clearErrors();
      }, 2000);
    }
  }, [props.error])

  if(userProp.current && userProp.current.accountType==="Admin")
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
      <Card>
      <CardContent>
        <Container maxWidth="md" className={classes.formStyle}>
          <Formik            
            initialValues={{
              email: '',
              firstName: '',
              lastName: '',
              orgName:'',
              orgPosition:'',
              mobNumber:'',
              password: '',
              type:'Trial',
              cost:0,
              limit:250,
              validFrom: moment(Date.now()),
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
              console.log(values)
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
              setFieldValue,
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
                    <br/>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="h5"
                    >
                      Personal Information
                    </Typography>
                    <br/>
                  <Divider/>
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
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
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
                    <br/>
                    <Divider/>
                    <br/>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="h5"
                    >
                      Contact Information
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <br/>
                    <Divider/>
                    <br/>
                  </Grid>
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>{/*Mobile number validation including country code*/}
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
                  <Grid item xs={12}>
                    <br/>
                    <Divider/>
                    <br/>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="h5"
                    >
                      Account Information
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <br/>
                    <Divider/>
                    <br/>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl variant="outlined" className={classes.formControl} fullWidth>
                      <InputLabel id="demo-simple-select-outlined-label">Account Type</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={values.type}
                        name="type"
                        onChange={(e)=>{
                          if(e.target.value==='Trial'){
                            setFieldValue("cost",0)
                            setFieldValue("limit",250)
                          }
                          setFieldValue("type",e.target.value)
                        }}
                        label="Account Type"
                      >
                        <MenuItem value="Trial">Trial</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl variant="outlined" className={classes.formControl} fullWidth>
                      <TextField //disable this section and set it to 0 when account type is not paid
                        label="Cost"
                        name="cost"
                        onChange={handleChange}
                        value={values.cost}
                        variant="outlined"
                        type="number"
                        InputProps={{ inputProps: { min: 0} }}
                        disabled={(values.type==='Trial')?true:false}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} >
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
                        onChange={date=>setFieldValue('validFrom',moment(date))}
                        KeyboardButtonProps = {{
                          'aria-label': 'change date',
                        }}
                        inputVariant="outlined"
                        minDate={moment()}
                        fullWidth
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
                        onChange={handleChange}
                        value={values.limit}
                        variant="outlined"
                        type="number"
                        InputProps={{ inputProps: { min: 0} }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>{/*Forget password section*/}
                    <FormControl variant="outlined" className={classes.formControl} fullWidth>
                    <TextField
                      error={Boolean(touched.password && errors.password)}
                      fullWidth
                      helperText={touched.password && errors.password}
                      label="Password"
                      margin="normal"
                      name="password"
                      type={passwordMask}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      variant="outlined"
                      InputProps={{endAdornment: <><IconButton size="small" onClick={()=>{
                        setFieldValue("password",Math.random().toString(36).slice(-8));
                      }}><AddIcon/></IconButton><IconButton size="small" onClick={()=>(passwordMask=="text") ? setpasswordMask("password") : setpasswordMask("text")}>{(passwordMask=="text") ? <VisibilityIcon/> : <VisibilityOffIcon/>}</IconButton></>}}
                    />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <br/>
                    <br/>
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
      </CardContent>
      </Card>
      </Box>
    </Page>) 
  else return <Unauthorized/>  
};

const mapStateToProps = state => ({
  notification:state.notification,
  error:state.error,
  user:state.auth.user
})

export default connect(mapStateToProps, { registerUser , clearNotifications , clearErrors })(RegisterView);
