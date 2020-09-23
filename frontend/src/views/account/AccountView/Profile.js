import React , { useEffect } from 'react';
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
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  }
}));

const Profile = (props) => {
  const { className, ...rest } = props
  const classes = useStyles();

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
          {props.user.firstName.charAt(0)}
          </Avatar>
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {props.user.firstName+" "+props.user.lastName}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            {props.user.orgPosition}            
          </Typography>
          <Typography
            className={classes.dateText}
            color="textSecondary"
            variant="body1"
          >
          {props.user.orgName}
          </Typography>
        </Box>
      </CardContent>
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
