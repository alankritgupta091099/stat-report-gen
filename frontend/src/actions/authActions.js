import axios from 'axios';
import { useRef } from "react";
import { useNavigate } from 'react-router-dom';

import { USER_LOADING , USER_LOADED , AUTH_ERROR , LOGIN_SUCCESS , LOGIN_FAIL , LOGOUT_SUCCESS , REGISTER_SUCCESS , REGISTER_FAIL } from "../actions/types.js";
import { returnErrors , clearErrors } from './errorActions';
import { returnNotifications , clearNotifications } from './notificationActions';
import { API_URL } from '../helpers/utils.js';

export const logoutUser = () => (dispatch) =>{
    dispatch({
        type:LOGOUT_SUCCESS
    }) 
}

export const loginUser = ( user ) => ( dispatch , getState ) => {
    axios.post(`${API_URL}/post/user/login`,user)
        .then(res=>{
            console.log(res.data)
            dispatch(returnNotifications("Login Successful!!","LOGIN_SUCCESS"))
            dispatch(clearErrors());
            dispatch({
                type:LOGIN_SUCCESS,
                payload:res.data
            })
        })
        .catch(err=>{
            dispatch(returnErrors(err.response.data, err.response.status,'LOGIN_FAIL'))
            dispatch({
                type:LOGIN_FAIL
            })
        })    
}

export const registerUser = ( newUser ) => ( dispatch , getState ) => {
    axios.post(`${API_URL}/post/user/reg`,newUser, tokenConfig(getState))
        .then(res=>{
            dispatch(returnNotifications(res.data.status,"REGISTER_SUCCESS"))
            dispatch({
                type:REGISTER_SUCCESS,
                //payload:res.data
            })
        })
        .catch(err=>{
            dispatch(returnErrors(err.response.data, err.response.status,'REGISTER_FAIL'))
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