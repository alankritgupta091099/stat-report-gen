import React, { useEffect , useRef , useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, Box, Button, Divider, Drawer, Hidden, List, Typography, makeStyles } from '@material-ui/core';
import { BarChart as BarChartIcon, FilePlus as FilePlusIcon, LogOut as LogOutIcon, User as UserIcon, UserPlus as UserPlusIcon, Users as UsersIcon } from 'react-feather';
import Alert from '@material-ui/lab/Alert';

import NavItem from './NavItem';
import { connect } from 'react-redux';

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = (props) => {
  const { logout , onMobileClose, openMobile } = props;
  const classes = useStyles();
  const location = useLocation();

  const userProp = useRef(props.user)
  const [user, setUser] = useState({
    avatar: 'A',
    orgName: 'Organisation Name',
    name: 'Name',
    limitLeft:0,
    limit:0,
    type:'Trial'
  });
  const [sev, setsev] = useState("error")

  const [items, setitems] = useState([  
    {
      href:'/app/report-gen',
      icon: FilePlusIcon,
      title: 'Generate Report'
    },
    {
      href: '/app/account',
      icon: UserIcon,
      title: 'Account'
    },
  ])

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  useEffect(() => {    
    userProp.current=props.user;
    if(userProp.current){
      setUser({
        avatar: userProp.current.firstName.charAt(0),
        orgName: userProp.current.orgName,
        name: userProp.current.firstName+" "+userProp.current.lastName,        
        limit: userProp.current.plan.limit,
        type: userProp.current.accountType,
        limitLeft: userProp.current.plan.limitLeft 
      })

      if(userProp.current.accountType==='Trial')
        setsev("warning")
      else if(userProp.current.accountType=="Expired")
        setsev("error")
      else setsev("success")

      if(userProp.current.accountType==="Admin")
        setitems([{
        href: '/app/dashboard',
        icon: BarChartIcon,
        title: 'Dashboard'
      },
      {
        href: '/app/register-new',
        icon: UserPlusIcon,
        title: 'Create New User'
      },
      {
        href: '/app/customers',
        icon: UsersIcon,
        title: 'Customers'
      },
      {
        href:'/app/report-gen',
        icon: FilePlusIcon,
        title: 'Generate Report'
      },
      {
        href: '/app/account',
        icon: UserIcon,
        title: 'Account'
      }])      
    }
  }, [props.user])

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          to="/app/account"
        >
        {user.avatar}
        </Avatar>
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.orgName}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Divider/>
      <Box m={2}>
        <Alert severity={sev}>
        <Typography
          color="textSecondary"
          variant="body2"
        >
        <strong>Account Type:</strong> <i>{user.type}</i>
        </Typography>
        {(()=>{
          if(user.type==='Trial')
            return (
              <>
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                <strong>Credit Limit: </strong>{user.limit}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                <strong>Credits Left: </strong>{user.limitLeft}
                </Typography>
              </>
            )
          else if(user.type==='Paid')
              return (
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                  <i><strong>Unlimited Access</strong></i>
                </Typography>
              )
          else if(user.type==='Expired')
              return (
                <Typography
                color="textSecondary"
                variant="body2"
                >
                <strong><i>Contact Us!</i></strong>
                </Typography>
              )
        })()}
      </Alert>
      </Box>
      <Divider/>
      <Box
        ml={7.5}
        mt={3}
      >
        <Button
            color="primary"
            component="a"
            size="medium"
            onClick={logout}
            href="/"
            startIcon={<LogOutIcon/>}
            variant="outlined"
            ml={7.5}
          >
            &nbsp;Logout
          </Button>
        
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

const mapStateToProps = state => ({
  user:state.auth.user
})

export default connect(mapStateToProps,null)(NavBar);
