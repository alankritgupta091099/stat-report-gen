import axios from 'axios';
import { useRef } from "react";
import { useNavigate } from 'react-router-dom';

import { USER_LOADING , USER_LOADED , AUTH_ERROR , LOGIN_SUCCESS , LOGIN_FAIL , LOGOUT_SUCCESS , REGISTER_SUCCESS , REGISTER_FAIL } from "../actions/types.js";
import { returnErrors , clearErrors } from './errorActions';
import { returnNotifications , clearNotifications } from './notificationActions';
import { API_URL } from '../helpers/utils.js';

//const navigate = useRef(useNavigate());

export const registerUser = ( newUser ) => dispatch => {
    console.log(newUser)
    axios.post(`${API_URL}/post/user/reg`,newUser)
        .then(res=>{
            dispatch(returnNotifications("Registered Successfully!!","REGISTER_SUCCESS"))
            dispatch({
                type:REGISTER_SUCCESS,
                payload:res.data
            })
//            navigate('/app/dashboard', { replace: true });
        })
        .catch(err=>{
            dispatch(returnErrors(err.response.data.msg, err.response.status,'REGISTER_FAIL'))
            dispatch({
                type:REGISTER_FAIL
            })
        })
}

export const loadUser = () => ( dispatch , getState ) => {
    dispatch({
        type:USER_LOADING
    });
    axios.get(`${API_URL}/get/user/fromToken`,tokenConfig(getState))
        .then(res=>dispatch({
            type:USER_LOADED,
            payload:res.data
        }))
        .catch(err=>{
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type:AUTH_ERROR
            })
        })
}

export const tokenConfig = getState => {
    const token=getState().auth.token;
    const config = {
        headers:{
            'Content-type':'application/json'
        }
    }
    if(token){
        config.headers['x-auth-token'] = token
    }
    return config;
}