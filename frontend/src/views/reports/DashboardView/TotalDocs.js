import React , { useState , useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import { FileText } from 'react-feather';
import axios from 'axios';

import { API_URL } from 'src/helpers/utils.js';
import store from "src/store.js";

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.indigo[600],
    height: 56,
    width: 56
  }
}));

const TotalDocs = ({ className, ...rest }) => {
  const classes = useStyles();
  const [docsNum, setdocsNum] = useState(0)
  
  useEffect(() => {
    axios({
        method:'GET',
        url:`${API_URL}/get/stats/totalDocs`,
        headers:{'x-auth-token': store.getState().auth.token}
      })
      .then((result) => {
        setdocsNum(result.data)
      }).catch((err) => {
        console.log(err)
      });
  }, [])

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              TOTAL DOUMENTS
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {docsNum}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <FileText />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalDocs.propTypes = {
  className: PropTypes.string
};

export default TotalDocs;
