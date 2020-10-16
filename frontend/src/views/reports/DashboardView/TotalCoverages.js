import React, { useState , useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import axios from 'axios';
import moment from 'moment';

import { API_URL } from 'src/helpers/utils.js';
import store from "src/store.js";

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  }
}));

const TotalCoverages = ({ className, ...rest }) => {
  const classes = useStyles();
  const [coverages, setcoverages] = useState(0)

  useEffect(() => {
    axios({
        method:'GET',
        url:`${API_URL}/get/stats/coveragesScanned`,
        headers:{'x-auth-token': store.getState().auth.token}
      })
      .then((result) => {
        setcoverages(result.data)
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
              TOTAL COVERAGES<br/><small><i> in {moment().format('MMMM')}</i></small>
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {coverages}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalCoverages.propTypes = {
  className: PropTypes.string
};

export default TotalCoverages;
