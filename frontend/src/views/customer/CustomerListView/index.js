import React, { useState , useEffect , useRef } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';

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

  useEffect(() => {    
    userProp.current=props.user;    
    if(userProp.current){
      setUser(userProp.current.accountType)
    }
  }, [props.user])

  if(userProp.current && userProp.current.accountType=="Admin")
  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Results/>
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
