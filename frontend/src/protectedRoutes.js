import React , {useEffect} from 'react'
import { Route , Navigate } from "react-router-dom";

import { loadUser } from "src/actions/authActions.js";
import store from './store';

const PrivateRoute = ({ component: Component, redirectTo, isAuth, path, ...props }) => {
    useEffect(() => {
        store.dispatch(loadUser())
    }, [])
    if(!store.getState().auth.token) {
        return <Navigate to='/login' />;
    }
    return <Route path="/" element={<Component />} />
};

export default PrivateRoute