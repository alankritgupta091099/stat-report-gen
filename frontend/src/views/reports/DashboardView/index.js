import React, { useState , useEffect , useRef } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Page from 'src/components/Page';
import Budget from './Budget';
import Stats from './Stats';
import TotalCoverages from './TotalCoverages';
import TotalCustomers from './TotalCustomers';
import TotalDocs from './TotalDocs';

import Unauthorized from 'src/views/errors/unauthorized.js'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = (props) => {
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
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalCustomers />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalCoverages />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalDocs />
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={9}
            xs={12}
          >
            <Stats />
          </Grid>          
        </Grid>
      </Container>
    </Page>
  )
  else return <Unauthorized/>
};

const mapStateToProps = state => ({
  user:state.auth.user
})

export default connect(mapStateToProps,null)(Dashboard);
