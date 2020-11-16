import React , { useEffect , useState , useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
  },
}));

const Profile = (props) => {
  const { className, ...rest } = props
  const classes = useStyles();

  const userProp = useRef(props.user)
  const [user, setUser] = useState({
    avatar: 'A',
    orgName: 'Organisation Name',
    name: 'Name'
  });

  useEffect(() => {    
    userProp.current=props.user;
    if(userProp.current){
      setUser({
        avatar: userProp.current.firstName.charAt(0),
        orgName: userProp.current.orgName,
        orgPosition: userProp.current.orgPosition,
        name: userProp.current.firstName+" "+userProp.current.lastName
      })        
    }
  }, [props.user])

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Avatar
            className={classes.avatar}
          >
            {user.avatar}
          </Avatar>
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {user.name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            {user.orgPosition}            
          </Typography>
          <Typography
            className={classes.dateText}
            color="textSecondary"
            variant="body1"
          >
            {user.orgName}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button href="/app/account/history" color="primary" 
          className={clsx(classes.expand)}>
          Check History
        </Button>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

const mapStateToProps = state => ({
  user:state.auth.user
})

export default connect(mapStateToProps,null)(Profile);
