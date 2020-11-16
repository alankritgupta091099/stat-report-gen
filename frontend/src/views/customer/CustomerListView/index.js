import React, { useState , useEffect , useRef } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import axios from 'axios';

import { API_URL } from 'src/helpers/utils.js';
import store from "src/store.js";
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import Unauthorized from 'src/views/errors/unauthorized.js'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerListView = (props) => {
  const classes = useStyles();
  const [user, setUser] = useState("")
  const userProp = useRef(props.user)
  const [getAllCustomers, setgetAllCustomers] = useState([])
  const [getSelectedCustomers, setgetSelectedCustomers] = useState([])
  const [istableData, setistableData] = useState(true)
 
  useEffect(() => {
    axios({
        method:'get',
        url:`${API_URL}/get/customers/all`,
        headers:{'x-auth-token': store.getState().auth.token}
      })
      .then((result) => {
        setgetAllCustomers(result.data)
      }).catch((err) => {
        console.log(err)
      });
  }, [])

  useEffect(() => {    
    userProp.current=props.user;    
    if(userProp.current){
      setUser(userProp.current.accountType)
    }
  }, [props.user])

  const ddValues = [
    {
      key:"Name",
      value:"name"
    },
    {
      key:"Organisation Name",
      value:"orgName"
    },
    {
      key:"Account Status",
      value:"type"
    },
    {
      key:"Email",
      value:"email"
    },
    {
      key:"Validity From",
      value:"validFrom"
    },
    {
      key:"Validity Until",
      value:"validUntil"
    },
    {
      key:"Credit Limit (Less than)",
      value:"limit-less"
    },
    {
      key:"Credit Limit (More than)",
      value:"limit-more"
    },
    {
      key:"Credit Limit Left (Less than)",
      value:"limitLeft-less"
    },
    {
      key:"Credit Limit Left (More than)",
      value:"limitLeft-more"
    },
  ]
  const [selectedDD, setselectedDD] = useState(ddValues[0].value)
  
  if(userProp.current && userProp.current.accountType==="Admin")
  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar ddValues={ddValues} setselectedDD={setselectedDD} getAllCustomers={getAllCustomers} setgetSelectedCustomers={setgetSelectedCustomers} setistableData={setistableData} getSelectedCustomers={getSelectedCustomers}/>
        <Box mt={3}>
          <Results getAllCustomers={getAllCustomers} getSelectedCustomers={getSelectedCustomers} istableData={istableData}/>
        </Box>
      </Container>
    </Page>
  ) 
  else return <Unauthorized/>
};

const mapStateToProps = state => ({
  user:state.auth.user
})

export default connect(mapStateToProps,null)(CustomerListView);
