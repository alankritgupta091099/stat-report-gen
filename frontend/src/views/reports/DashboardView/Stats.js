import React, { useState , useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  makeStyles,
  colors, Grid
} from '@material-ui/core';
import moment from 'moment';
import axios from 'axios';

import StatUsage from './StatUsage.js'
import { API_URL } from 'src/helpers/utils.js';
import store from "src/store.js";

const useStyles = makeStyles(() => ({
  root: {}
}));

const Stats = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [newData, setnew] = useState([])
  const [oldData, setold] = useState([])
  const [usage, setUsage] = useState(0)

  useEffect(() => {
     axios({
        method:'GET',
        url:`${API_URL}/get/stats/statHistory`,
        headers:{'x-auth-token': store.getState().auth.token}
      })
      .then((result) => {
        var stats= result.data.stats;
        setUsage(result.data.perc*100)
        console.log(usage)
        setnew([
          stats['today-6'].new,
          stats['today-5'].new,
          stats['today-4'].new,
          stats['today-3'].new,
          stats['today-2'].new,
          stats['today-1'].new,
          stats['today'].new
        ])
        setold([stats['today-6'].old,stats['today-5'].old,stats['today-4'].old,stats['today-3'].old,stats['today-2'].old,stats['today-1'].old,stats['today'].old])
      }).catch((err) => {
        console.log(err)
      });
  }, [])

  const data = {
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        data: newData,
        label: 'New Stats'
      },
      {
        backgroundColor: colors.grey[200],
        data: oldData,
        label: 'Old Stats'
      }
    ],
    labels: [
      moment().subtract(6,'days').format('D MMM'),
      moment().subtract(5,'days').format('D MMM'), 
      moment().subtract(4,'days').format('D MMM'), 
      moment().subtract(3,'days').format('D MMM'), 
      moment().subtract(2,'days').format('D MMM'), 
      moment().subtract(1,'days').format('D MMM'), 
      moment().format('D MMM')]
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider
          }
        }
      ]
    },
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        lg={8}
        sm={6}
        xl={3}
        xs={12}
      >          
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        action={(
          <Button
            size="large"
            variant="outlined"
            color="primary"
          >
            Total: {newData[6]+oldData[6]}
          </Button>
        )}
        title="Publisher's Database"
      />
      <Divider />
      <CardContent>
        <Box
          height={400}
          position="relative"
        >
          <Bar
            data={data}
            options={options}
          />
        </Box>
      </CardContent>
    </Card>
    </Grid>
     <Grid
        item
        lg={4}
        sm={6}
        xl={3}
        xs={12}
      >    
        <StatUsage used={usage}/>
      </Grid>
    </Grid>
  );
};

Stats.propTypes = {
  className: PropTypes.string
};

export default Stats;
