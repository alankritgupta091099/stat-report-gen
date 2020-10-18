import React , { useState , useEffect , useRef } from 'react'
import { Box, Button, Container, Card, CardContent, CardHeader, Divider, Grid, TextField, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core';
import moment from "moment";
import axios from 'axios';
import { connect } from 'react-redux';

import { API_URL } from 'src/helpers/utils.js';
import store from "src/store.js";
import Page from 'src/components/Page';

const useStyles = makeStyles(() => ({
  root: {},
  table: {
    minWidth: 650,
  },
}));

function OrderHistory(props) {
    const classes = useStyles();
    const [history, sethistory] = useState([])
    const userProp = useRef(props.user)

    useEffect(() => {
        userProp.current=props.user;    
        if(userProp.current)
            axios({
                method:'get',
                url:`${API_URL}/get/customer/history/${store.getState().auth.user._id}`,
                headers:{'x-auth-token': store.getState().auth.token}
            })
            .then((result) => {
                sethistory(result.data)
            }).catch((err) => {
                console.log(err)
            });
    }, [props.user])

    return (
        <Page
            className={classes.root}
            title="Account"
        >
            <Container>
                <Box mt={3}>
                    <Card>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Links Generated</TableCell>
                                    <TableCell>Mailing Date</TableCell>
                                    <TableCell>Mailing Time</TableCell>                            
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {history.map((row) => (
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {row.count}
                                        </TableCell>
                                        <TableCell>{moment(row.time).format('DD MMM YYYY')}</TableCell>
                                        <TableCell>{moment(row.time).format('LTS')}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Box>
            </Container>
        </Page>
    )
}

const mapStateToProps = state => ({
  user:state.auth.user
})

export default connect(mapStateToProps,null)(OrderHistory)