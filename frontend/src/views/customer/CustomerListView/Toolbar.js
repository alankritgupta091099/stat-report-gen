import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Box, Button, Card, CardContent, TextField, InputAdornment, SvgIcon, makeStyles, Grid , Select , MenuItem , FormControl } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, ddValues, setselectedDD, getAllCustomers, setgetSelectedCustomers, setistableData, getSelectedCustomers, ...rest }) => {
  const classes = useStyles();
  const [dd, setdd] = React.useState(ddValues[0].value)
  const [searchBarType, setsearchBarType] = React.useState("text")
  const [dateSearchBox, setdateSearchBox] = React.useState(false)
  const [date, setDate] = React.useState(new Date())

  const handleChange = (event) => {
    setselectedDD(event.target.value)
    setdd(event.target.value);
    setdateSearchBox(false)
    if(event.target.value === "limit-less" || event.target.value === "limit-more")
      setsearchBarType("number")
    else if(event.target.value ==='validFrom' || event.target.value ==='validUntil'){      
      setdateSearchBox(true)
      setistableData(true)      
    } else 
      setsearchBarType("text")
  };

  const handleSearchChange = (event) =>{
    var newArr = [];
    setistableData(true)
    getAllCustomers.filter((cust)=>{
      switch (dd) {
        case "name":{
          var name = cust.firstName+" "+cust.lastName
          if(name.toLowerCase().search(event.target.value.toLowerCase())!=-1)
            newArr.push(cust)
          break;
        }
        case "orgName":{
          var name = cust.orgName
          if(name.toLowerCase().search(event.target.value.toLowerCase())!=-1)
            newArr.push(cust)
          break;
        }
        case "type":{
          var name = cust.accountType
          if(name.toLowerCase().search(event.target.value.toLowerCase())!=-1)
            newArr.push(cust)
          break;
        }
        case "email":{
          var name = cust.email
          if(name.toLowerCase().search(event.target.value.toLowerCase())!=-1)
            newArr.push(cust)
          break;
        }
        case "limit-less":{
          var limit = cust.plan.limit
          if(limit<event.target.value)
            newArr.push(cust)
          break;
        }
        case "limit-more":{
          var limit = cust.plan.limit
          if(limit>event.target.value)
            newArr.push(cust)
          break;
        }
        case "limitLeft-less":{
          var limit = cust.plan.limitLeft
          console.log(limit)
          if(limit<event.target.value)
            newArr.push(cust)
          break;
        }
        case "limitLeft-more":{
          var limit = cust.plan.limitLeft
          console.log(limit)
          if(limit>event.target.value)
            newArr.push(cust)
          break;
        }
      }
    })
    newArr.length===0 ? setistableData(false):setgetSelectedCustomers(newArr)
  }

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button className={classes.exportButton} onClick={()=>{
          var exportArr = [];
          var arr = getSelectedCustomers.length === 0 ? getAllCustomers : getSelectedCustomers
          arr.forEach(element => {
            exportArr.push({
              Name: element.firstName+" "+element.lastName,
              Email: element.email,
              Phone_Number : element.mobNumber,
              Organisation : element.orgName,
              Designation : element.orgPosition,
              Account_Status: element.accountType,
              Cost : element.plan.cost,
              Account_Valid_From : element.plan.validFrom,
              Total_Credits : element.plan.limit,
              Credits_Left : element.plan.limitLeft
            })
          });
          const ws = XLSX.utils.json_to_sheet(exportArr);
          const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const data = new Blob([excelBuffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"});
          FileSaver.saveAs(data,"Customers.xlsx");
        }}>
          Export
        </Button>
        <Button
          color="primary"
          variant="contained"
          href="/app/register-new"
        >
          Add customer
        </Button>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
          <Grid
            container
            spacing={3}
          >            
            <Grid
              item
              sm={6}
              xs={12}
            >
              {
                dateSearchBox ? 
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <FormControl variant="outlined" className={classes.formControl} fullWidth>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="DD/MM/YYYY"
                        name="validFrom"
                        value={date}
                        onChange={(date)=>{
                          setDate(moment(date))
                          setistableData(true)
                          var newArr = [];
                          getAllCustomers.filter((cust)=>{
                            switch (dd) {
                              case 'validFrom':{
                                var dateValidFrom = cust.plan.validFrom
                                if(moment(date).isBefore(dateValidFrom))
                                  newArr.push(cust)
                                break;
                              }
                              case 'validUntil':{
                                var dateValidFrom = cust.plan.validFrom
                                if(!moment(date).isBefore(dateValidFrom))
                                  newArr.push(cust)
                                break;
                              }
                            }                            
                          })
                          newArr.length===0 ? setistableData(false):setgetSelectedCustomers(newArr)
                        }}
                        KeyboardButtonProps = {{
                          'aria-label': 'change date',
                        }}
                        inputVariant="outlined"
                      />   
                    </FormControl>
                  </MuiPickersUtilsProvider> 
                : 
                  <TextField
                      fullWidth
                      onChange={handleSearchChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SvgIcon
                              fontSize="small"
                              color="action"
                            >
                              <SearchIcon />
                            </SvgIcon>
                          </InputAdornment>
                        )
                      }}
                      placeholder="Search"
                      variant="outlined"
                      type={searchBarType}
                    />
              }              
            </Grid>
            <Grid
              item
              sm={1}
              xs={12}
            >
              <FormControl variant="outlined">
                <Select
                  value={dd}
                  onChange={handleChange}
                  displayEmpty
                  className={classes.selectEmpty}
                >
                  {ddValues.map((item)=>{
                    return <MenuItem value={item.value}>{item.key}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
